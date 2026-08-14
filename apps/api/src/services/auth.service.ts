import { prisma } from '../lib/db';
import type { User } from '../lib/db';
import { hashPassword, verifyPassword, validatePasswordStrength } from './password.service';
import { generateOtp, generateMagicToken, storeToken, consumeToken } from './token.service';
import { sendOtpEmail, sendMagicLinkEmail, sendPasswordResetEmail, sendWelcomeEmail } from './email.service';
import { issueSession, verifyPendingToken, issuePendingToken } from './session.service';
import { revokeAllUserSessions } from './session.service';
import { logger } from '../config/logger';
import { env, webAppUrl } from '../config/env';

const OTP_EXPIRY_MS = 10 * 60 * 1000;
const MAGIC_LINK_EXPIRY_MS = 15 * 60 * 1000;

// Version stamped on agreements accepted at signup. The web fetches the live
// TOS version and passes it through; this is the fallback used by the Google
// OAuth path (which has no explicit checkbox in this phase).
export const CURRENT_AGREEMENT_VERSION = '1.0';

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}

export async function signUpWithPassword(
  input: {
    email: string;
    name: string;
    password: string;
    agreedToTerms?: boolean;
    agreementVersion?: string;
    intent?: 'buyer' | 'vendor';
  },
  ctx: RequestContext,
): Promise<{ otpSent: true; pendingToken: string }> {
  const strength = validatePasswordStrength(input.password);
  if (!strength.valid) {
    throw new Error(strength.reason ?? 'Invalid password');
  }

  const isVendorIntent = input.intent === 'vendor';

  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing && existing.hasPassword && existing.emailVerified) {
    logger.info({ email: input.email }, 'Signup attempted for existing verified account');
    // Return a pending token so the client can still proceed to /verify-otp
    // (the OTP flow is a no-op here, but the contract must stay consistent).
    return { otpSent: true, pendingToken: await issuePendingToken(input.email) };
  }

  const passwordHash = await hashPassword(input.password);

  const agreementData =
    input.agreedToTerms && input.agreementVersion
      ? {
          agreementVersion: input.agreementVersion,
          agreementAcceptedAt: new Date(),
          agreementIp: ctx.ipAddress,
          agreementUserAgent: ctx.userAgent,
        }
      : {};

  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        name: input.name,
        passwordHash,
        hasPassword: true,
        // Promote to vendor context only if this is a fresh (unverified) account
        // being (re)registered with vendor intent; never demote an existing role.
        ...(isVendorIntent && existing.role === 'buyer'
          ? { role: 'vendor' }
          : {}),
        ...agreementData,
      },
    });
  } else {
    await prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        passwordHash,
        hasPassword: true,
        role: isVendorIntent ? 'vendor' : 'buyer',
        status: 'active',
        ...agreementData,
      },
    });
  }

  const otp = generateOtp();
  await storeToken({
    email: input.email,
    token: otp,
    type: 'otp',
    expiresInMs: OTP_EXPIRY_MS,
    ipAddress: ctx.ipAddress,
    userAgent: ctx.userAgent,
  });

  // Don't block account creation on email delivery failures, but make a real
  // attempt to deliver the OTP (with one retry for transient Resend blips) so
  // the user gets the code on first signup rather than needing "resend".
  try {
    await sendOtpEmail({ to: input.email, otp });
  } catch (err) {
    logger.warn({ email: input.email, err }, 'OTP send failed on first try; retrying once');
    try {
      await new Promise((r) => setTimeout(r, 800));
      await sendOtpEmail({ to: input.email, otp });
    } catch (err2) {
      logger.error({ email: input.email, err: err2 }, 'Failed to send OTP email during signup after retry');
    }
  }
  return { otpSent: true, pendingToken: await issuePendingToken(input.email) };
}

export async function verifyOtp(
  input: { email: string; otp: string },
): Promise<{ sessionToken: string; user: User }> {
  const result = await consumeToken({ token: input.otp, type: 'otp' });
  if (!result || result.email !== input.email) {
    throw new Error('Invalid or expired code');
  }

  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw new Error('Account not found');
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: new Date() },
  });

  // Send a welcome email the first time an account is verified.
  if (!user.emailVerified) {
    try {
      await sendWelcomeEmail({ to: user.email, name: user.name });
    } catch {
      // welcome email is best-effort
    }
  }

  const sessionToken = await issueSession({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  return { sessionToken, user: updated };
}

export async function resendOtp(input: { email: string }): Promise<{ otpSent: true }> {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    // Avoid account enumeration: pretend success even if no account exists.
    return { otpSent: true };
  }

  const otp = generateOtp();
  await storeToken({
    email: input.email,
    token: otp,
    type: 'otp',
    expiresInMs: OTP_EXPIRY_MS,
  });

  await sendOtpEmail({ to: input.email, otp });
  return { otpSent: true };
}

export async function signInWithPassword(
  input: { email: string; password: string },
): Promise<{ sessionToken: string; user: User } | null> {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user || !user.passwordHash) {
    return null;
  }
  const valid = await verifyPassword(user.passwordHash, input.password);
  if (!valid) {
    return null;
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { lastSignInAt: new Date() },
  });

  const sessionToken = await issueSession({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  return { sessionToken, user: updated };
}

export async function requestMagicLink(
  input: { email: string },
  ctx: RequestContext,
): Promise<{ linkSent: true }> {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    logger.info({ email: input.email }, 'Magic link requested for non-existent account');
    return { linkSent: true };
  }

  const token = generateMagicToken();
  await storeToken({
    email: input.email,
    token,
    type: 'magic_link',
    purpose: 'signin',
    expiresInMs: MAGIC_LINK_EXPIRY_MS,
    userId: user.id,
    ipAddress: ctx.ipAddress,
    userAgent: ctx.userAgent,
  });

  const webUrl = webAppUrl;
  const url = `${webUrl}/auth-callback?token=${encodeURIComponent(token)}`;
  await sendMagicLinkEmail({ to: input.email, url });
  return { linkSent: true };
}

export async function consumeMagicLink(
  token: string,
): Promise<{ sessionToken: string; user: User } | null> {
  const result = await consumeToken({ token, type: 'magic_link', purpose: 'signin' });
  if (!result) return null;

  const user = await prisma.user.findUnique({ where: { email: result.email } });
  if (!user) return null;

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      lastSignInAt: new Date(),
      emailVerified: user.emailVerified ?? new Date(),
    },
  });

  const sessionToken = await issueSession({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  return { sessionToken, user: updated };
}

export async function requestPasswordReset(
  input: { email: string },
  ctx: RequestContext,
): Promise<{ linkSent: true }> {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    logger.info({ email: input.email }, 'Password reset requested for non-existent account');
    return { linkSent: true };
  }

  const token = generateMagicToken();
  await storeToken({
    email: input.email,
    token,
    type: 'magic_link',
    purpose: 'password_reset',
    expiresInMs: MAGIC_LINK_EXPIRY_MS,
    userId: user.id,
    ipAddress: ctx.ipAddress,
    userAgent: ctx.userAgent,
  });

  const webUrl = webAppUrl;
  const url = `${webUrl}/reset-password?token=${encodeURIComponent(token)}`;
  await sendPasswordResetEmail({ to: input.email, url });
  return { linkSent: true };
}

export async function consumePasswordReset(params: {
  token: string;
  newPassword: string;
}): Promise<{ sessionToken: string; user: User } | null> {
  const strength = validatePasswordStrength(params.newPassword);
  if (!strength.valid) {
    throw new Error(strength.reason ?? 'Invalid password');
  }

  const result = await consumeToken({
    token: params.token,
    type: 'magic_link',
    purpose: 'password_reset',
  });
  if (!result) return null;

  const user = await prisma.user.findUnique({ where: { email: result.email } });
  if (!user) return null;

  const passwordHash = await hashPassword(params.newPassword);
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      hasPassword: true,
      lastSignInAt: new Date(),
      emailVerified: user.emailVerified ?? new Date(),
    },
  });

  const sessionToken = await issueSession({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  // Revoke all DB-backed sessions (e.g. admin impersonation) on password reset.
  // Standard auth uses stateless JWTs, so callers should also invalidate the old
  // JWT client-side; this clears any server-persisted sessions for the user.
  await revokeAllUserSessions(user.id);

  return { sessionToken, user: updated };
}

export async function acceptAgreement(
  userId: string,
  version: string,
  ctx: RequestContext,
): Promise<User> {
  return prisma.user.update({
    where: { id: userId },
    data: {
      agreementVersion: version,
      agreementAcceptedAt: new Date(),
      agreementIp: ctx.ipAddress,
      agreementUserAgent: ctx.userAgent,
    },
  });
}

export async function setDefaultCampus(userId: string, campusId: string): Promise<User> {
  return prisma.user.update({
    where: { id: userId },
    data: { defaultCampusId: campusId },
  });
}
