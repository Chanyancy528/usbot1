import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only if you need client-side access
})

export const defaultModel = process.env.OPENAI_MODEL || 'gpt-3.5-turbo' 