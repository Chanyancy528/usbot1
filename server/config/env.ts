export const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4',
    organization: process.env.OPENAI_ORG,
  },
  azure: {
    endpoint: process.env.AZURE_ENDPOINT,
    apiKey: process.env.AZURE_API_KEY,
    speechKey: process.env.AZURE_SPEECH_KEY,
    speechRegion: process.env.AZURE_SPEECH_REGION,
  },
  google: {
    projectId: process.env.GOOGLE_PROJECT_ID,
    credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  },
  redis: {
    url: process.env.REDIS_URL,
  },
  server: {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || 'development',
  }
} 