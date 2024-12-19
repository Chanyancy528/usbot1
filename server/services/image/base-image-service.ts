export interface ImageGenerationOptions {
  prompt: string;
  width?: number;
  height?: number;
  numSteps?: number;
  guidanceScale?: number;
  negativePrompt?: string;
  provider: 'dalle' | 'stable-diffusion' | 'midjourney';
  style?: string;
}

export interface ImageGenerationResult {
  url: string;
  provider: string;
  metadata?: Record<string, any>;
}

export abstract class BaseImageService {
  abstract generateImage(options: ImageGenerationOptions): Promise<ImageGenerationResult>;
} 