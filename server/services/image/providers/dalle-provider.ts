import { BaseImageService, ImageGenerationOptions, ImageGenerationResult } from '../base-image-service'
import { Configuration, OpenAIApi } from 'openai'
import { config } from '@/server/config/env'

export class DallEProvider extends BaseImageService {
  private openai = new OpenAIApi(new Configuration({
    apiKey: config.openai.apiKey
  }))

  async generateImage(options: ImageGenerationOptions): Promise<ImageGenerationResult> {
    const { prompt, width = 1024, height = 1024 } = options
    
    const response = await this.openai.createImage({
      prompt,
      n: 1,
      size: `${width}x${height}`,
      response_format: "url"
    })

    return {
      url: response.data.data[0].url,
      provider: 'dalle',
      metadata: { model: 'dall-e-3' }
    }
  }
} 