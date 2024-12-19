import axios from 'axios'
import { CacheService } from '../cache-service'
import { rateLimiter } from '../../middleware/rate-limit'

export class ElevenLabsService {
  private static baseUrl = 'https://api.elevenlabs.io/v1';
  private static rateLimitConfig = {
    maxRequests: 30,
    windowMs: 60 * 1000
  };

  private static headers = {
    'xi-api-key': process.env.ELEVENLABS_API_KEY!,
    'Content-Type': 'application/json',
  };

  static async textToSpeech(text: string, voiceId: string) {
    const cacheKey = CacheService.generateKey('tts', text, voiceId);
    
    // Check cache
    const cached = await CacheService.get(cacheKey);
    if (cached) return cached;

    // Apply rate limiting
    await rateLimiter(null as any, this.rateLimitConfig);

    try {
      const response = await axios.post(
        `${this.baseUrl}/text-to-speech/${voiceId}`,
        { text },
        { headers: this.headers, responseType: 'arraybuffer' }
      );

      // Cache the response
      await CacheService.set(cacheKey, response.data);

      return response.data;
    } catch (error) {
      console.error('ElevenLabs API error:', error);
      throw error;
    }
  }
} 