import { createParser } from 'eventsource-parser'
import { config } from '@/server/config/env'

export async function OpenAIStream(messages: any[]) {
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.openai.apiKey}`,
    },
    method: 'POST',
    body: JSON.stringify({
      model: config.openai.model,
      messages,
      stream: true,
    }),
  })

  const stream = new ReadableStream({
    async start(controller) {
      const parser = createParser((event) => {
        if (event.type === 'event') {
          try {
            const data = JSON.parse(event.data)
            const text = data.choices[0]?.delta?.content || ''
            const queue = encoder.encode(text)
            controller.enqueue(queue)
          } catch (e) {
            controller.error(e)
          }
        }
      })

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk))
      }

      controller.close()
    },
  })

  return stream
} 