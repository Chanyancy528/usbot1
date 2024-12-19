import axios from 'axios'

interface TTSOptions {
  voiceId?: string;
  modelId?: string;
  stability?: number;
  similarityBoost?: number;
}

export class ElevenLabsTTS {
  private static API_KEY = process.env.ELEVENLABS_API_KEY
  private static BASE_URL = 'https://api.elevenlabs.io/v1'
  private static DEFAULT_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'default_voice_id'

  static async textToSpeech(
    text: string, 
    options: TTSOptions = {}
  ): Promise<ArrayBuffer> {
    try {
      const {
        voiceId = this.DEFAULT_VOICE_ID,
        modelId = 'eleven_monolingual_v1',
        stability = 0.5,
        similarityBoost = 0.75
      } = options

      const response = await axios.post(
        `${this.BASE_URL}/text-to-speech/${voiceId}`,
        {
          text,
          model_id: modelId,
          voice_settings: {
            stability,
            similarity_boost: similarityBoost
          }
        },
        {
          headers: {
            'xi-api-key': this.API_KEY,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg'
          },
          responseType: 'arraybuffer'
        }
      )

      return response.data
    } catch (error) {
      console.error('ElevenLabs TTS error:', error)
      throw error
    }
  }

  static async getVoices() {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/voices`,
        {
          headers: {
            'xi-api-key': this.API_KEY
          }
        }
      )
      return response.data.voices
    } catch (error) {
      console.error('Failed to fetch voices:', error)
      throw error
    }
  }
} 