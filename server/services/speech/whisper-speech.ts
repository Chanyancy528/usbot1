import { Configuration, OpenAIApi } from 'openai'
import { config } from '@/server/config/env'

export class WhisperSpeechService {
  private static openai = new OpenAIApi(new Configuration({
    apiKey: config.openai.apiKey
  }))

  static async speechToText(audioData: Buffer): Promise<string> {
    try {
      const response = await this.openai.createTranscription(
        audioData,
        "whisper-1",
        undefined,
        undefined,
        0.3,
        "en"
      )
      return response.data.text
    } catch (error) {
      console.error('Speech to text error:', error)
      throw error
    }
  }
} 