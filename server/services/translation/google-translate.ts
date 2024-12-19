import { TranslationServiceClient } from '@google-cloud/translate'
import { config } from '@/server/config/env'

export class GoogleTranslateService {
  private static client = new TranslationServiceClient()
  private static projectId = config.google.projectId

  static async translateText(text: string, targetLanguage: string): Promise<string> {
    try {
      const request = {
        parent: `projects/${this.projectId}/locations/global`,
        contents: [text],
        mimeType: 'text/plain',
        targetLanguageCode: targetLanguage,
      }

      const [response] = await this.client.translateText(request)
      return response.translations?.[0]?.translatedText || text
    } catch (error) {
      console.error('Translation error:', error)
      throw error
    }
  }

  static async detectLanguage(text: string): Promise<string> {
    try {
      const request = {
        parent: `projects/${this.projectId}/locations/global`,
        content: text,
        mimeType: 'text/plain',
      }

      const [response] = await this.client.detectLanguage(request)
      return response.languages?.[0]?.languageCode || 'en'
    } catch (error) {
      console.error('Language detection error:', error)
      throw error
    }
  }
} 