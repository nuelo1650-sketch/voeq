import type { Request, Response, NextFunction } from 'express';
import { jwtVerify } from 'jose';
import { env } from '../config/env';

const secret = new TextEncoder().encode(env.AUTH_SECRET);

export interface AuthedRequest extends Request {
  userId?: string;
  userRole?: string;
  sessionId?: string;
}

export async function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token = req.cookies?.['voeq_session'];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized', message: 'No session' });
    return;
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    if (typeof payload.sub !== 'string') {
      throw new Error('Invalid token payload');
    }
    req.userId = payload.sub;
    req.userRole = typeof payload.role === 'string' ? payload.role : 'buyer';
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized', message: 'Invalid session' });
  }
}

export async function optionalAuth(
  req: AuthedRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const token = req.cookies?.['voeq_session'];
  if (!token) {
    next();
    return;
  }
  try {
    const { payload } = await jwtVerify(token, secret);
    if (typeof payload.sub === 'string') {
      req.userId = payload.sub;
      req.userRole = typeof payload.role === 'string' ? payload.role : 'buyer';
      req.sessionId = payload.jti as string | undefined;
    }
  } catch {
    // Invalid token, continue without auth
  }
  next();
}
