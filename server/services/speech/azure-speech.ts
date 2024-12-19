import { SpeechConfig, AudioConfig, SpeechSynthesizer, SpeechRecognizer } from 'microsoft-cognitiveservices-speech-sdk'
import { config } from '@/server/config/env'

export class AzureSpeechService {
  private static speechConfig = SpeechConfig.fromSubscription(
    config.azure.speechKey!,
    config.azure.speechRegion!
  )

  static async textToSpeech(text: string): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const audioConfig = AudioConfig.fromDefaultSpeakerOutput()
      const synthesizer = new SpeechSynthesizer(this.speechConfig, audioConfig)

      synthesizer.speakTextAsync(
        text,
        result => {
          synthesizer.close()
          resolve(result.audioData)
        },
        error => {
          synthesizer.close()
          reject(error)
        }
      )
    })
  }

  static async speechToText(audioData: ArrayBuffer): Promise<string> {
    return new Promise((resolve, reject) => {
      const audioConfig = AudioConfig.fromWavFileInput(audioData)
      const recognizer = new SpeechRecognizer(this.speechConfig, audioConfig)

      recognizer.recognizeOnceAsync(
        result => {
          recognizer.close()
          resolve(result.text)
        },
        error => {
          recognizer.close()
          reject(error)
        }
      )
    })
  }
} 