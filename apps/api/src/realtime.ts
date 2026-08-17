import type { Server as HttpServer } from 'http';
import { Server as IOServer, type Socket } from 'socket.io';
import { jwtVerify } from 'jose';
import { env } from './config/env';
import { getSessionCookieName } from './services/session.service';
import { prisma } from './lib/db';
import { sendMessage } from './services/conversation.service';

const secret = new TextEncoder().encode(env.AUTH_SECRET);

interface ChatSocket extends Socket {
  userId?: string;
  userRole?: string;
}

export function createRealtime(httpServer: HttpServer): IOServer {
  const io = new IOServer(httpServer, {
    cors: {
      origin: env.CORS_ORIGIN ? env.CORS_ORIGIN.split(',') : true,
      credentials: true,
    },
    // Avoid racing with the HTTP health check during cold starts.
    pingTimeout: 20000,
    pingInterval: 25000,
  });

  // Authenticate on connection via the same session cookie used by REST.
  io.use(async (socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie ?? '';
      const name = getSessionCookieName();
      const match = cookieHeader.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
      const token = match?.[1];
      if (!token) return next(new Error('Unauthorized'));

      const { payload } = await jwtVerify(token, secret);
      if (typeof payload.sub !== 'string') return next(new Error('Unauthorized'));
      (socket as ChatSocket).userId = payload.sub;
      (socket as ChatSocket).userRole = typeof payload.role === 'string' ? payload.role : 'buyer';
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket: ChatSocket) => {
    const userId = socket.userId!;

    // Join a conversation room (after verifying membership).
    socket.on('join', async (conversationId: string) => {
      const ok = await isParticipant(conversationId, userId);
      if (ok) socket.join(roomFor(conversationId));
    });

    socket.on('leave', (conversationId: string) => {
      socket.leave(roomFor(conversationId));
    });

    // Send a message: persist via the existing service, then broadcast.
    socket.on('message', async (payload: { conversationId: string; body: string }, ack?: (r: unknown) => void) => {
      try {
        const body = typeof payload?.body === 'string' ? payload.body.trim().slice(0, 4000) : '';
        if (!body) return;
        const ok = await isParticipant(payload.conversationId, userId);
        if (!ok) return;

        const message = await sendMessage(payload.conversationId, userId, body);
        io.to(roomFor(payload.conversationId)).emit('message', message);
        ack?.({ ok: true, message });
      } catch {
        ack?.({ ok: false });
      }
    });
  });

  return io;
}

function roomFor(conversationId: string): string {
  return `conv:${conversationId}`;
}

async function isParticipant(conversationId: string, userId: string): Promise<boolean> {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { vendor: { select: { userId: true } } },
  });
  if (!conversation) return false;
  return conversation.shopperId === userId || conversation.vendor.userId === userId;
}
