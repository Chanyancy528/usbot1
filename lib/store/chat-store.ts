import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  translation?: string
  audioUrl?: string
  imageUrl?: string
  timestamp: number
}

interface LoadingState {
  chat: boolean;
  speech: boolean;
  translation: boolean;
  image: boolean;
}

interface ProgressState {
  speech: number;
  translation: number;
  image: number;
}

interface Voice {
  id: string;
  name: string;
  preview_url?: string;
}

interface ChatState {
  messages: Message[]
  isListening: boolean
  isTranslating: boolean
  showTranslations: boolean
  targetLanguage: string
  isLoading: LoadingState
  error: string | null
  progress: ProgressState;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
  setIsListening: (isListening: boolean) => void
  setShowTranslations: (show: boolean) => void
  setTargetLanguage: (language: string) => void
  setLoading: (key: keyof LoadingState, value: boolean) => void
  setError: (error: string | null) => void
  setProgress: (key: keyof ProgressState, value: number) => void;
  selectedVoice: Voice | null;
  useFallbackTTS: boolean;
  setSelectedVoice: (voice: Voice | null) => void;
  setUseFallbackTTS: (use: boolean) => void;
}

export const useChatStore = create<ChatState>()(
  devtools((set) => ({
    messages: [],
    isListening: false,
    isTranslating: false,
    showTranslations: false,
    targetLanguage: 'en',
    isLoading: {
      chat: false,
      speech: false,
      translation: false,
      image: false
    },
    error: null,
    progress: {
      speech: 0,
      translation: 0,
      image: 0
    },
    addMessage: (message) =>
      set((state) => ({
        messages: [
          ...state.messages,
          { ...message, id: crypto.randomUUID(), timestamp: Date.now() },
        ],
      })),
    setIsListening: (isListening) => set({ isListening }),
    setShowTranslations: (show) => set({ showTranslations: show }),
    setTargetLanguage: (language) => set({ targetLanguage: language }),
    setLoading: (key, value) => 
      set((state) => ({
        isLoading: { ...state.isLoading, [key]: value }
      })),
    setError: (error) => set({ error }),
    setProgress: (key, value) => 
      set((state) => ({
        progress: { ...state.progress, [key]: value }
      })),
    selectedVoice: null,
    useFallbackTTS: false,
    setSelectedVoice: (voice) => set({ selectedVoice: voice }),
    setUseFallbackTTS: (use) => set({ useFallbackTTS: use }),
  }))
) 