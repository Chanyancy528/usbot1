import { Configuration, OpenAIApi } from 'openai'
import { config } from '@/server/config/env'

export class DallEService {
  private static openai = new OpenAIApi(new Configuration({
    apiKey: config.openai.apiKey
  }))

  static async generateImage(prompt: string): Promise<string> {
    try {
      const response = await this.openai.createImage({
        prompt,
        n: 1,
        size: "1024x1024",
        response_format: "url"
      })
      return response.data.data[0].url
    } catch (error) {
      console.error('Image generation error:', error)
      throw error
    }
  }

  static async generateImageVariation(imageData: Buffer): Promise<string> {
    try {
      const response = await this.openai.createImageVariation(
        imageData,
        1,
        "1024x1024",
        "url"
      )
      return response.data.data[0].url
    } catch (error) {
      console.error('Image variation error:', error)
      throw error
    }
  }
} 