import { BrowserTTS } from '@/server/services/speech/browser-tts'
import { useChatStore } from '@/lib/store/chat-store'

type PipelineTask<T> = () => Promise<T>

interface PipelineStage<T> {
  name: string;
  task: PipelineTask<T>;
  parallel?: boolean;
}

interface TTSStageOptions {
  voiceId?: string;
  stability?: number;
  similarityBoost?: number;
}

export class PipelineManager {
  private static audioContext: AudioContext | null = null;
  private static audioBuffer: AudioBuffer[] = [];
  private static isProcessing = false;

  static async process<T>(stages: PipelineStage<T>[]) {
    const results: Partial<Record<string, T>> = {};
    const parallelStages: PipelineStage<T>[] = [];
    
    for (const stage of stages) {
      if (stage.parallel) {
        parallelStages.push(stage);
        continue;
      }

      if (parallelStages.length > 0) {
        // Process parallel stages
        const parallelResults = await Promise.all(
          parallelStages.map(async (ps) => ({
            name: ps.name,
            result: await ps.task()
          }))
        );
        
        parallelResults.forEach(({ name, result }) => {
          results[name] = result;
        });
        parallelStages.length = 0;
      }

      // Process current stage
      results[stage.name] = await stage.task();
    }

    return results;
  }

  // Audio pipeline optimization
  static initAudio() {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
    return this.audioContext;
  }

  static async bufferAudio(audioData: ArrayBuffer) {
    try {
      const ctx = this.initAudio()
      const buffer = await ctx.decodeAudioData(audioData)
      
      // Implement chunking for large audio files
      const CHUNK_SIZE = 5 // seconds
      const sampleRate = buffer.sampleRate
      const chunksCount = Math.ceil(buffer.duration / CHUNK_SIZE)

      for (let i = 0; i < chunksCount; i++) {
        const startSample = i * CHUNK_SIZE * sampleRate
        const endSample = Math.min((i + 1) * CHUNK_SIZE * sampleRate, buffer.length)
        
        const chunkBuffer = new AudioBuffer({
          length: endSample - startSample,
          numberOfChannels: buffer.numberOfChannels,
          sampleRate: buffer.sampleRate
        })

        // Copy data for each channel
        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
          const channelData = buffer.getChannelData(channel)
          chunkBuffer.copyToChannel(
            channelData.slice(startSample, endSample),
            channel
          )
        }

        this.audioBuffer.push(chunkBuffer)
      }

      this.processAudioQueue()
    } catch (error) {
      console.error('Audio buffering error:', error)
      throw error
    }
  }

  private static async processAudioQueue() {
    if (this.isProcessing || this.audioBuffer.length === 0) return;
    this.isProcessing = true;

    try {
      const ctx = this.initAudio();
      while (this.audioBuffer.length > 0) {
        const buffer = this.audioBuffer.shift()!;
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        
        await new Promise<void>((resolve) => {
          source.onended = () => resolve();
          source.start(0);
        });
      }
    } finally {
      this.isProcessing = false;
    }
  }

  static async createTTSStage(text: string, options?: TTSStageOptions) {
    return {
      name: 'tts',
      task: async () => {
        try {
          const { useFallbackTTS } = useChatStore.getState()

          if (useFallbackTTS) {
            await BrowserTTS.textToSpeech(text, {
              voice: options?.voiceId,
              rate: 1,
              pitch: 1
            })
            return null
          }

          const audioData = await ElevenLabsTTS.textToSpeech(text, options)
          if (audioData) {
            await this.bufferAudio(audioData)
          }
          return audioData
        } catch (error) {
          console.error('TTS stage error:', error)
          // Automatically fall back to browser TTS on error
          try {
            await BrowserTTS.textToSpeech(text)
          } catch (fallbackError) {
            console.error('Fallback TTS error:', fallbackError)
          }
          throw error
        }
      },
      parallel: true
    }
  }
} 