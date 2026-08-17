import { io, type Socket } from 'socket.io-client';
import { env } from './env';

let socket: Socket | null = null;

export function getChatSocket(): Socket {
  if (!socket) {
    const apiUrl = env.NEXT_PUBLIC_API_URL ?? '';
    socket = io(apiUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });
  }
  return socket;
}
