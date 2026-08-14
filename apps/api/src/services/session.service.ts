import { SignJWT, jwtVerify } from 'jose';
import { env } from '../config/env';
import { prisma } from '../lib/db';
import type { UserRole } from '../lib/db';

const secret = new TextEncoder().encode(env.AUTH_SECRET);
const SESSION_DURATION_SECONDS = 30 * 24 * 60 * 60;

export interface SessionPayload {
  sub: string;
  email: string;
  role: UserRole;
  vendorStatus?: string | null;
}

/**
 * Short-lived token issued at signup and required to verify the OTP. Prevents
 * OTP enumeration / resend-bombing: an attacker cannot hit /verify-otp or
 * /resend-otp with an arbitrary ?email= without a valid pending token that was
 * only ever produced by a real signup. Carries the email as its subject so the
 * API can confirm the OTP being verified belongs to the signup that started it.
 */
const PENDING_DURATION_SECONDS = 5 * 60;

export async function issuePendingToken(email: string): Promise<string> {
  return new SignJWT({ purpose: 'otp' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(email)
    .setIssuedAt()
    .setExpirationTime(`${PENDING_DURATION_SECONDS}s`)
    .sign(secret);
}

export async function verifyPendingToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.purpose === 'otp' && typeof payload.sub === 'string') {
      return payload.sub;
    }
    return null;
  } catch {
    return null;
  }
}

export async function issueSession(payload: SessionPayload): Promise<string> {
  // Derive vendorStatus at sign-time from the existing Vendor row (no separate
  // column). Only meaningful when role === 'vendor'; null otherwise.
  let vendorStatus: string | null = null;
  if (payload.role === 'vendor') {
    const vendor = await prisma.vendor.findUnique({
      where: { userId: payload.sub },
      select: { status: true },
    });
    vendorStatus = vendor?.status ?? null;
  }

  return new SignJWT({
    email: payload.email,
    role: payload.role,
    vendorStatus,
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

/**
 * Revoke a specific session by token hash
 */
export async function revokeSession(tokenHash: string): Promise<void> {
  await prisma.session.deleteMany({ where: { tokenHash } });
}

/**
 * Revoke all sessions for a user (logout everywhere).
 * Used by password reset, account deletion, suspicious activity.
 * Pass exceptTokenHash to keep one session (e.g. the caller's current one) alive.
 */
export async function revokeAllUserSessions(
  userId: string,
  exceptTokenHash?: string,
): Promise<number> {
  const result = await prisma.session.deleteMany({
    where: {
      userId,
      ...(exceptTokenHash ? { tokenHash: { not: exceptTokenHash } } : {}),
    },
  });
  return result.count;
}
