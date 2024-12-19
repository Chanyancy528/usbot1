import { Redis } from 'ioredis'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const redis = new Redis(process.env.REDIS_URL!)

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const defaultConfig: RateLimitConfig = {
  maxRequests: 60,
  windowMs: 60 * 1000, // 1 minute
}

export async function rateLimiter(
  request: NextRequest,
  config: RateLimitConfig = defaultConfig
) {
  const ip = request.ip || 'anonymous'
  const key = `ratelimit:${ip}`

  const [requests] = await redis
    .multi()
    .incr(key)
    .expire(key, Math.ceil(config.windowMs / 1000))
    .exec() as [number, any]

  if (requests > config.maxRequests) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  }
} 