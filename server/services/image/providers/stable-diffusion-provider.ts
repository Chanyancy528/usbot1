import { BaseImageService, ImageGenerationOptions, ImageGenerationResult } from '../base-image-service'
import axios from 'axios'
import { config } from '@/server/config/env'

export class StableDiffusionProvider extends BaseImageService {
  private apiKey = config.stableDiffusion.apiKey
  private apiEndpoint = config.stableDiffusion.apiEndpoint

  async generateImage(options: ImageGenerationOptions): Promise<ImageGenerationResult> {
    const {
      prompt,
      width = 1024,
      height = 1024,
      numSteps = 50,
      guidanceScale = 7.5,
      negativePrompt
    } = options

    const response = await axios.post(this.apiEndpoint, {
      prompt,
      negative_prompt: negativePrompt,
      width,
      height,
      num_inference_steps: numSteps,
      guidance_scale: guidanceScale
    }, {
      headers: { Authorization: `Bearer ${this.apiKey}` }
    })

    return {
      url: response.data.output[0],
      provider: 'stable-diffusion',
      metadata: {
        model: 'sd-xl-turbo',
        steps: numSteps,
        guidance: guidanceScale
      }
    }
  }
} 