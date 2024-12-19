import { config } from 'dotenv'
import { resolve } from 'path'

const requiredEnvVars = [
  'OPENAI_API_KEY',
  'OPENAI_MODEL',
  'ELEVENLABS_API_KEY',
  'ELEVENLABS_VOICE_ID',
  'NEXT_PUBLIC_WS_URL',
  'NEXT_PUBLIC_CLIENT_URL'
]

function checkEnv() {
  const envFile = process.env.NODE_ENV === 'production' 
    ? '.env.production' 
    : '.env.local'
  
  config({ path: resolve(process.cwd(), envFile) })

  const missingVars = requiredEnvVars.filter(
    varName => !process.env[varName]
  )

  if (missingVars.length > 0) {
    console.error('Missing required environment variables:')
    missingVars.forEach(varName => console.error(`- ${varName}`))
    process.exit(1)
  }

  console.log('✅ All required environment variables are set')
}

checkEnv() 