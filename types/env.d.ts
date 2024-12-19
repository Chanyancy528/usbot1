declare namespace NodeJS {
  interface ProcessEnv {
    OPENAI_API_KEY: string;
    OPENAI_MODEL: string;
    ELEVENLABS_API_KEY: string;
    ELEVENLABS_VOICE_ID: string;
    NEXT_PUBLIC_WS_URL: string;
    NEXT_PUBLIC_CLIENT_URL: string;
    PORT: string;
    NODE_ENV: 'development' | 'production' | 'test';
    CORS_ORIGINS: string;
    API_SECRET_KEY: string;
    REDIS_URL: string;
    RATE_LIMIT_MAX_REQUESTS: string;
    RATE_LIMIT_WINDOW_MS: string;
    CACHE_TTL: string;
  }
} 