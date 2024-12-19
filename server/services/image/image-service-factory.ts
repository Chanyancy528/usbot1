import { BaseImageService } from './base-image-service'
import { DallEProvider } from './providers/dalle-provider'
import { StableDiffusionProvider } from './providers/stable-diffusion-provider'

export class ImageServiceFactory {
  private static providers: Record<string, BaseImageService> = {
    'dalle': new DallEProvider(),
    'stable-diffusion': new StableDiffusionProvider(),
  }

  static getProvider(name: string): BaseImageService {
    const provider = this.providers[name]
    if (!provider) {
      throw new Error(`Image provider ${name} not found`)
    }
    return provider
  }
} 