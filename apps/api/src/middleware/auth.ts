import type { Request, Response, NextFunction } from 'express';
import { jwtVerify } from 'jose';
import { env } from '../config/env';
import { getSessionCookieName, lookupSession } from '../services/session.service';

const secret = new TextEncoder().encode(env.AUTH_SECRET);
const SESSION_COOKIE = getSessionCookieName();

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
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized', message: 'No session' });
    return;
  }

  try {
    // Verify the JWT signature/expiry first.
    const { payload } = await jwtVerify(token, secret);
    if (typeof payload.sub !== 'string') {
      throw new Error('Invalid token payload');
    }
    // Then confirm the session still exists and isn't revoked/expired server-side.
    // This is what makes logout / revoke-all actually invalidate the token.
    const session = await lookupSession(token);
    if (!session) {
      res.status(401).json({ error: 'Unauthorized', message: 'Session revoked' });
      return;
    }
    req.userId = payload.sub;
    req.userRole = typeof payload.role === 'string' ? payload.role : 'buyer';
    req.sessionId = typeof payload.jti === 'string' ? payload.jti : undefined;
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
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) {
    next();
    return;
  }
  try {
    const { payload } = await jwtVerify(token, secret);
    if (typeof payload.sub === 'string') {
      const session = await lookupSession(token);
      if (session) {
        req.userId = payload.sub;
        req.userRole = typeof payload.role === 'string' ? payload.role : 'buyer';
        req.sessionId = typeof payload.jti === 'string' ? payload.jti : undefined;
      }
    }
  } catch {
    // Invalid token, continue without auth
  }
  next();
}
