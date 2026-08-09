import { SignJWT, jwtVerify } from 'jose';
import { env } from '../config/env';
import type { UserRole } from '../lib/db';

const secret = new TextEncoder().encode(env.AUTH_SECRET);
const SESSION_DURATION_SECONDS = 30 * 24 * 60 * 60;

export interface SessionPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export async function issueSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({
    email: payload.email,
    role: payload.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (
      typeof payload.sub === 'string' &&
      typeof payload.email === 'string' &&
      typeof payload.role === 'string'
    ) {
      return {
        sub: payload.sub,
        email: payload.email,
        role: payload.role as UserRole,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function getSessionCookieName(): string {
  return env.NODE_ENV === 'production' ? '__Secure-voeq_session' : 'voeq_session';
}

export function getSessionCookieOptions(): {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'none';
  maxAge: number;
  path: string;
} {
  const apiUrl = env.NEXT_PUBLIC_API_URL;
  const webUrl = env.WEB_URL;
  let secure = env.NODE_ENV === 'production';
  let sameSite: 'lax' | 'none' = 'lax';

  if (apiUrl && webUrl) {
    try {
      const apiHost = new URL(apiUrl).host;
      const webHost = new URL(webUrl).host;
      const isLocalhost = (host: string) => host === 'localhost' || host === '127.0.0.1' || host.startsWith('localhost:');
      if (!isLocalhost(apiHost) && !isLocalhost(webHost) && apiHost !== webHost) {
        // Cross-site production: require secure + SameSite=None
        sameSite = 'none';
        secure = true;
      }
    } catch {
      // invalid URL, keep defaults
    }
  }

  return {
    httpOnly: true,
    secure,
    sameSite,
    maxAge: SESSION_DURATION_SECONDS,
    path: '/',
  };
}
