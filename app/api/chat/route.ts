import { NextRequest } from 'next/server'
import { authMiddleware } from '@/server/middleware/auth'
import { rateLimiter } from '@/server/middleware/rate-limit'
import { OpenAIService } from '@/server/services/api/openai-service'

export async function POST(req: NextRequest) {
  // Apply middleware
  const authResult = await authMiddleware(req);
  if (authResult) return authResult;

  const rateLimit = await rateLimiter(req);
  if (rateLimit) return rateLimit;

  try {
    const { messages } = await req.json();
    const cacheKey = `chat:${JSON.stringify(messages)}`;
    
    const response = await OpenAIService.generateResponse(messages, cacheKey);
    return new Response(response.data);
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
} 