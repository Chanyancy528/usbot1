import { io, Socket } from 'socket.io-client'

export class WebSocketService {
  private static socket: Socket

  static initialize() {
    this.socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL!, {
      transports: ['websocket'],
      reconnection: true,
    })

    this.socket.on('connect', () => {
      console.log('WebSocket connected')
    })

    return this.socket
  }

  static getInstance() {
    if (!this.socket) {
      this.initialize()
    }
    return this.socket
  }
} 