import { Server as HTTPServer } from 'http'
import { Server as SocketServer } from 'socket.io'
import { EventEmitter } from 'events'

export class WebSocketServer extends EventEmitter {
  private io: SocketServer | null = null;

  initialize(server: HTTPServer) {
    this.io = new SocketServer(server, {
      cors: {
        origin: process.env.NEXT_PUBLIC_CLIENT_URL,
        methods: ['GET', 'POST']
      },
      pingTimeout: 60000,
    });

    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('speech_start', () => {
        this.emit('speech_start', socket.id);
      });

      socket.on('speech_end', () => {
        this.emit('speech_end', socket.id);
      });

      socket.on('stream_progress', (data) => {
        socket.emit('progress_update', data);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  broadcast(event: string, data: any) {
    this.io?.emit(event, data);
  }

  sendTo(socketId: string, event: string, data: any) {
    this.io?.to(socketId).emit(event, data);
  }
}

export const wsServer = new WebSocketServer(); 