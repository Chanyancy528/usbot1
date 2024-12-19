import { useCallback, useEffect } from 'react'
import { useChatStore } from '../store/chat-store'
import { APIService } from '../services/api-service'
import { useWebSocket } from 'react-use-websocket'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { WebSocketManager } from '../services/websocket-manager'
import { MessageQueue } from '../utils/message-queue'
import { throttle } from '../utils/request-helpers'
import { CacheManager } from '../utils/cache-manager'
import { ParallelProcessor } from '../utils/parallel-processor'
import { PipelineManager } from '../utils/pipeline-manager'
import { ElevenLabsTTS } from '@/server/services/speech/elevenlabs-tts'
import { SpeechRecognitionManager } from '../services/speech/speech-recognition-manager'

export function useChat() {
  const { 
    messages, 
    addMessage, 
    setLoading,
    setError,
    setProgress 
  } = useChatStore()
  const { transcript, resetTranscript } = useSpeechRecognition()
  
  // Initialize WebSocket
  useEffect(() => {
    try {
      WebSocketManager.initialize()
    } catch (error) {
      setError('Failed to connect to real-time services')
    }
  }, [])

  useEffect(() => {
    // Initialize speech recognition
    SpeechRecognitionManager.initialize().catch(error => {
      console.error('Failed to initialize speech recognition:', error);
      setError('Failed to initialize speech recognition');
    });

    // Cleanup on unmount
    return () => {
      SpeechRecognitionManager.cleanup();
    };
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    const processMessage = async () => {
      setLoading('chat', true)
      
      try {
        const results = await PipelineManager.process([
          {
            name: 'userMessage',
            task: async () => {
              addMessage({ role: 'user', content })
              return content
            }
          },
          {
            name: 'chatResponse',
            task: async () => {
              const response = await APIService.streamChatCompletion([
                ...messages,
                { role: 'user', content }
              ])

              let fullResponse = ''
              const textDecoder = new TextDecoder()
              const reader = response.body?.getReader()
              
              if (!reader) throw new Error('Stream not available')

              while (true) {
                const { done, value } = await reader.read()
                if (done) break
                
                const chunk = textDecoder.decode(value)
                fullResponse += chunk
                
                // Update UI in real-time
                addMessage({
                  role: 'assistant',
                  content: fullResponse,
                  temporary: true
                })
              }

              // Start TTS with error handling and recovery
              try {
                const { selectedVoice } = useChatStore.getState()
                await PipelineManager.createTTSStage(fullResponse, {
                  voiceId: selectedVoice?.id || process.env.ELEVENLABS_VOICE_ID,
                  stability: 0.5,
                  similarityBoost: 0.75
                })
              } catch (ttsError) {
                console.error('TTS failed, using fallback:', ttsError)
                useChatStore.getState().setUseFallbackTTS(true)
              }

              return fullResponse
            }
          }
        ])

        // Final message update
        addMessage({
          role: 'assistant',
          content: results.chatResponse as string,
          temporary: false
        })

      } catch (error) {
        setError('Failed to process message')
        console.error('Pipeline error:', error)
      } finally {
        setLoading('chat', false)
      }
    }

    await MessageQueue.enqueue(processMessage)
  }, [messages, addMessage, setLoading, setError])

  // Throttle speech recognition updates
  const handleSpeechResult = throttle((transcript: string) => {
    if (transcript) {
      sendMessage(transcript)
    }
  }, 1000)

  return {
    sendMessage,
    toggleListening,
    isListening,
    transcript
  }
} 