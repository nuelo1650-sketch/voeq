import { randomBytes, randomInt, createHash } from 'node:crypto';
import { prisma } from '../lib/db';
import type { AuthTokenType } from '../lib/db';

export function generateOtp(): string {
  return randomInt(100000, 1000000).toString();
}

export function generateMagicToken(): string {
  return randomBytes(32).toString('base64url');
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export async function storeToken(params: {
  email: string;
  token: string;
  type: AuthTokenType;
  expiresInMs: number;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
}): Promise<void> {
  await prisma.authToken.create({
    data: {
      email: params.email.toLowerCase(),
      tokenHash: hashToken(params.token),
      type: params.type,
      expiresAt: new Date(Date.now() + params.expiresInMs),
      userId: params.userId,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    },
  });
}

export async function consumeToken(params: {
  token: string;
  type: AuthTokenType;
}): Promise<{ email: string; userId: string | null } | null> {
  const tokenHash = hashToken(params.token);
  const record = await prisma.authToken.findUnique({
    where: { tokenHash },
  });

  if (!record) return null;
  if (record.type !== params.type) return null;
  if (record.consumedAt !== null) return null;
  if (record.expiresAt < new Date()) return null;

  await prisma.authToken.update({
    where: { id: record.id },
    data: { consumedAt: new Date() },
  });

  return { email: record.email, userId: record.userId };
}
