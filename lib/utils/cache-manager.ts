interface CacheOptions {
  expirationTime?: number; // in milliseconds
  forceRefresh?: boolean;
}

export class CacheManager {
  private static CACHE_NAME = 'chat-cache-v1';
  private static DEFAULT_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours

  static async get<T>(key: string): Promise<T | null> {
    try {
      const cache = await caches.open(this.CACHE_NAME);
      const response = await cache.match(key);
      
      if (!response) return null;

      const data = await response.json();
      if (this.isExpired(data.timestamp)) {
        await this.delete(key);
        return null;
      }

      return data.value;
    } catch (error) {
      console.error('Cache retrieval error:', error);
      return null;
    }
  }

  static async set<T>(
    key: string, 
    value: T, 
    options: CacheOptions = {}
  ): Promise<void> {
    try {
      const cache = await caches.open(this.CACHE_NAME);
      const data = {
        value,
        timestamp: Date.now(),
        expirationTime: options.expirationTime || this.DEFAULT_EXPIRATION
      };

      const response = new Response(JSON.stringify(data));
      await cache.put(key, response);
    } catch (error) {
      console.error('Cache storage error:', error);
    }
  }

  static async delete(key: string): Promise<void> {
    const cache = await caches.open(this.CACHE_NAME);
    await cache.delete(key);
  }

  private static isExpired(timestamp: number): boolean {
    return Date.now() - timestamp > this.DEFAULT_EXPIRATION;
  }
} 