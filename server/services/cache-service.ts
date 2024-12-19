import { Redis } from 'ioredis'

export class CacheService {
  private static redis: Redis;
  private static DEFAULT_TTL = 3600; // 1 hour

  static initialize() {
    if (!this.redis) {
      this.redis = new Redis(process.env.REDIS_URL!);
    }
  }

  static async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  static async set<T>(
    key: string,
    value: T,
    ttl: number = this.DEFAULT_TTL
  ): Promise<void> {
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }

  static async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }

  static generateKey(...parts: string[]): string {
    return parts.join(':');
  }
} 