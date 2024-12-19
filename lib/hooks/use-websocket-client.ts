import { useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useToast } from '@/components/ui/use-toast';
import { useChatStore } from '@/lib/store/chat-store';

export function useWebSocketClient() {
  const { toast } = useToast();
  const { setIsConnected, addMessage, setProgress } = useChatStore();
  let socket: Socket | null = null;

  const connect = useCallback(() => {
    if (socket?.connected) return;

    socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      setIsConnected(true);
      toast({
        title: 'Connected',
        description: 'Successfully connected to server',
      });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      toast({
        title: 'Disconnected',
        description: 'Lost connection to server',
        variant: 'destructive',
      });
    });

    socket.on('chat_response', (data) => {
      addMessage(data);
    });

    socket.on('progress_update', (data) => {
      setProgress(data.type, data.value);
    });

    socket.on('error', (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    });
  }, [setIsConnected, addMessage, setProgress, toast]);

  useEffect(() => {
    connect();
    return () => {
      socket?.disconnect();
    };
  }, [connect]);

  return socket;
} 