import { io, Socket } from 'socket.io-client'
import { useChatStore } from '@/lib/store/chat-store'

export class WebSocketManager {
  private static socket: Socket | null = null
  private static reconnectAttempts = 0
  private static maxReconnectAttempts = 5
  private static reconnectDelay = 1000

  static initialize() {
    if (this.socket) return this.socket

    this.socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL!, {
      transports: ['websocket'],
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
      autoConnect: true
    })

    this.setupEventHandlers()
    return this.socket
  }

  private static setupEventHandlers() {
    if (!this.socket) return

    this.socket.on('connect', () => {
      console.log('WebSocket connected')
      this.reconnectAttempts = 0
    })

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason)
      if (reason === 'io server disconnect') {
        this.socket?.connect()
      }
    })

    this.socket.on('speech_progress', (data: { progress: number }) => {
      // Update speech synthesis progress
      useChatStore.getState().setProgress('speech', data.progress)
    })

    this.socket.on('translation_progress', (data: { progress: number }) => {
      // Update translation progress
      useChatStore.getState().setProgress('translation', data.progress)
    })

    this.socket.on('error', (error: string) => {
      useChatStore.getState().setError(error)
    })
  }

  static emit(event: string, data: any) {
    if (!this.socket?.connected) {
      throw new Error('WebSocket not connected')
    }
    this.socket.emit(event, data)
  }

  static disconnect() {
    this.socket?.disconnect()
    this.socket = null
  }
} 