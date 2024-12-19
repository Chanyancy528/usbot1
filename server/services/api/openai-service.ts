import { Configuration, OpenAIApi } from 'openai'
import { CacheService } from '../cache-service'
import { rateLimiter } from '../../middleware/rate-limit'
import { withRetry } from '@/lib/utils/retry-handler'
import { ChatResponseSchema } from '@/lib/validation/api-schemas'
import { logger, monitorPerformance } from '@/lib/utils/logger'

export class OpenAIService {
  private static instance: OpenAIApi;
  private static rateLimitConfig = {
    maxRequests: 50,
    windowMs: 60 * 1000
  };

  private static getInstance(): OpenAIApi {
    if (!this.instance) {
      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      this.instance = new OpenAIApi(configuration);
    }
    return this.instance;
  }

  static async generateResponse(messages: any[], cacheKey?: string) {
    return monitorPerformance(async () => {
      // Check cache first
      if (cacheKey) {
        const cached = await CacheService.get(cacheKey);
        if (cached) {
          logger.info({
            message: 'Cache hit',
            cacheKey,
            messageCount: messages.length,
          });
          return cached;
        }
      }

      // Apply rate limiting
      await rateLimiter(null as any, this.rateLimitConfig);

      try {
        const response = await withRetry(
          () => this.getInstance().createChatCompletion({
            model: process.env.OPENAI_MODEL || 'gpt-4',
            messages,
            stream: true,
          }),
          {
            maxAttempts: 3,
            delay: 1000,
            onRetry: (error, attempt) => {
              logger.warn({
                message: 'Retrying OpenAI API call',
                attempt,
                error: error.message,
              });
            },
          }
        );

        // Validate response
        const validatedResponse = ChatResponseSchema.parse(response.data);

        // Cache the response if needed
        if (cacheKey) {
          await CacheService.set(cacheKey, validatedResponse);
        }

        return validatedResponse;
      } catch (error) {
        logger.error({
          message: 'OpenAI API error',
          error: error.message,
          stack: error.stack,
          messages: messages.length,
        });
        throw error;
      }
    }, 'openai_generate_response');
  }
} 