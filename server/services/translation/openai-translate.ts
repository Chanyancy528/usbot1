import { Configuration, OpenAIApi } from 'openai'
import { config } from '@/server/config/env'

export class OpenAITranslateService {
  private static openai = new OpenAIApi(new Configuration({
    apiKey: config.openai.apiKey
  }))

  static async translateText(text: string, targetLanguage: string): Promise<string> {
    try {
      const response = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a translator. Translate the following text to ${targetLanguage}. Only respond with the translation, nothing else.`
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.3
      })

      return response.data.choices[0]?.message?.content || text
    } catch (error) {
      console.error('Translation error:', error)
      throw error
    }
  }

  static async detectLanguage(text: string): Promise<string> {
    try {
      const response = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Detect the language of the following text. Respond only with the ISO language code (e.g., 'en', 'es', 'fr', etc.)."
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.1
      })

      return response.data.choices[0]?.message?.content?.toLowerCase() || 'en'
    } catch (error) {
      console.error('Language detection error:', error)
      throw error
    }
  }
} 