import axios from 'axios'
import { config } from '@/server/config/env'

export interface ImageGenerationOptions {
  prompt: string;
  width?: number;
  height?: number;
  additionalParams?: Record<string, any>;
}

export class ImageService {
  private static apiKey = process.env.IMAGE_API_KEY
  private static provider = process.env.IMAGE_PROVIDER
  private static endpoint = process.env.IMAGE_API_ENDPOINT

  static async generateImage(options: ImageGenerationOptions): Promise<string> {
    try {
      const { prompt, width = 1024, height = 1024, additionalParams = {} } = options

      const response = await axios.post(this.endpoint!, {
        prompt,
        width,
        height,
        ...additionalParams
      }, {
        headers: { 
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      // Return URL of generated image
      // You'll need to adjust this based on the actual API response structure
      return response.data.url || response.data.output?.[0] || response.data.data?.[0]?.url
    } catch (error) {
      console.error('Image generation error:', error)
      throw error
    }
  }
} 