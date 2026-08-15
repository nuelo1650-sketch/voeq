import { Router, type Request, type Response, type NextFunction } from 'express';
import {
  SignupWithPasswordSchema,
  VerifyOtpSchema,
  SignInWithPasswordSchema,
  RequestMagicLinkSchema,
  AcceptAgreementSchema,
  RequestPasswordResetSchema,
  ConsumePasswordResetSchema,
} from '../schemas/auth';
import {
  signUpWithPassword,
  verifyOtp,
  signInWithPassword,
  requestMagicLink,
  consumeMagicLink,
  acceptAgreement,
  requestPasswordReset,
  consumePasswordReset,
  resendOtp,
} from '../services/auth.service';
import { rateLimit, trackFailure } from '../middleware/rate-limit';
import { authLimiter, magicLimiter, agreementLimiter, rateLimitWithFallback } from '../middleware/rate-limit-upstash';
import { requireAuth, type AuthedRequest } from '../middleware/auth';
import { getClientIp } from '../utils/ip';
import { safeRedirect } from '../lib/redirect';
import { getSessionCookieName, getSessionCookieOptions, revokeAllUserSessions, revokeSession, hashToken, verifyPendingToken } from '../services/session.service';
import { env, webAppUrl } from '../config/env';
import { logger } from '../config/logger';
import { CURRENT_AGREEMENT_VERSION } from '../services/auth.service';
import { prisma } from '../lib/db';
import { ensureVendorRow } from '../services/vendor.service';
import { issueSession } from '../services/session.service';

export const authRouter: ReturnType<typeof Router> = Router();

authRouter.post(
  '/signup/password',
  rateLimitWithFallback(authLimiter, { windowMs: 15 * 60 * 1000, max: 5, keyPrefix: 'signup', keyFromBody: 'email' }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = SignupWithPasswordSchema.parse(req.body);
      const result = await signUpWithPassword(input, {
        ipAddress: getClientIp(req),
        userAgent: req.headers['user-agent'],
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
);

authRouter.post(
  '/verify-otp',
  rateLimitWithFallback(authLimiter, { windowMs: 15 * 60 * 1000, max: 5, keyPrefix: 'otp', keyFromBody: 'email', lockoutAfter: 5 }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = VerifyOtpSchema.parse(req.body);
      // Require a valid pending token issued by signup (prevents OTP
      // enumeration / resend-bombing with an arbitrary email).
      const pendingEmail = await verifyPendingToken(input.pendingToken ?? '');
      if (!pendingEmail || pendingEmail !== input.email) {
        res.status(401).json({ error: 'InvalidOrExpiredToken', message: 'Verification session expired. Please sign up again.' });
        return;
      }
      const result = await verifyOtp(input, {
        ipAddress: getClientIp(req),
        userAgent: req.headers['user-agent'] ?? null,
      });
      const vendor = await prisma.vendor.findUnique({
        where: { userId: result.user.id },
        select: { status: true },
      });
      res.cookie(getSessionCookieName(), result.sessionToken, getSessionCookieOptions());
      res.status(200).json({
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
          emailVerified: result.user.emailVerified,
          agreementAcceptedAt: result.user.agreementAcceptedAt,
          defaultCampusId: result.user.defaultCampusId,
          vendorStatus: vendor?.status ?? null,
        },
      });
    } catch (error) {
      trackFailure({ windowMs: 15 * 60 * 1000, max: 5, keyPrefix: 'otp', keyFromBody: 'email', lockoutAfter: 5 }, req);
      next(error);
    }
  },
);

authRouter.post(
  '/resend-otp',
  rateLimitWithFallback(authLimiter, { windowMs: 15 * 60 * 1000, max: 5, keyPrefix: 'resend-otp', keyFromBody: 'email', lockoutAfter: 5 }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = RequestMagicLinkSchema.parse(req.body);
      // Require a valid pending token so resend cannot be used to bomb an
      // arbitrary email.
      const pendingEmail = await verifyPendingToken(input.pendingToken ?? '');
      if (!pendingEmail || pendingEmail !== input.email) {
        res.status(401).json({ error: 'InvalidOrExpiredToken', message: 'Verification session expired. Please sign up again.' });
        return;
      }
      await resendOtp({ email: input.email });
      res.status(200).json({ otpSent: true });
    } catch (error) {
      trackFailure({ windowMs: 15 * 60 * 1000, max: 5, keyPrefix: 'resend-otp', keyFromBody: 'email', lockoutAfter: 5 }, req);
      next(error);
    }
  },
);

authRouter.post(
  '/signin/password',
  rateLimitWithFallback(authLimiter, { windowMs: 15 * 60 * 1000, max: 5, keyPrefix: 'signin' }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = SignInWithPasswordSchema.parse(req.body);
      const result = await signInWithPassword(input, {
        ipAddress: getClientIp(req),
        userAgent: req.headers['user-agent'] ?? null,
      });
      if (!result) {
        res.status(401).json({ error: 'InvalidCredentials' });
        return;
      }
      const vendor = await prisma.vendor.findUnique({
        where: { userId: result.user.id },
        select: { status: true },
      });
      res.cookie(getSessionCookieName(), result.sessionToken, getSessionCookieOptions());
      res.status(200).json({
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
          emailVerified: result.user.emailVerified,
          agreementAcceptedAt: result.user.agreementAcceptedAt,
          defaultCampusId: result.user.defaultCampusId,
          vendorStatus: vendor?.status ?? null,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

authRouter.post(
  '/magic-link',
  rateLimitWithFallback(magicLimiter, { windowMs: 15 * 60 * 1000, max: 3, keyPrefix: 'magic' }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = RequestMagicLinkSchema.parse(req.body);
      const result = await requestMagicLink(input, {
        ipAddress: getClientIp(req),
        userAgent: req.headers['user-agent'],
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
);

authRouter.post(
  '/magic-link/consume',
  rateLimitWithFallback(authLimiter, { windowMs: 15 * 60 * 1000, max: 5, keyPrefix: 'magic-consume' }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;
      if (typeof token !== 'string') {
        res.status(400).json({ error: 'TokenRequired' });
        return;
      }
      const result = await consumeMagicLink(token, {
        ipAddress: getClientIp(req),
        userAgent: req.headers['user-agent'] ?? null,
      });
      if (!result) {
        res.status(401).json({ error: 'InvalidOrExpiredToken' });
        return;
      }
      const vendor = await prisma.vendor.findUnique({
        where: { userId: result.user.id },
        select: { status: true },
      });
      res.cookie(getSessionCookieName(), result.sessionToken, getSessionCookieOptions());
      res.status(200).json({
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
          emailVerified: result.user.emailVerified,
          agreementAcceptedAt: result.user.agreementAcceptedAt,
          defaultCampusId: result.user.defaultCampusId,
          vendorStatus: vendor?.status ?? null,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

authRouter.post('/signout', async (req: Request, res: Response) => {
  const cookieName = getSessionCookieName();
  const token = req.cookies?.[cookieName];
  if (token) {
    // Revoke this device's session server-side so the JWT is invalid immediately,
    // not just locally cleared (which would leave it valid until 30d expiry).
    try {
      await revokeSession(hashToken(token));
    } catch {
      // best-effort; still clear the cookie below
    }
  }
  res.clearCookie(cookieName, { path: '/' });
  res.status(200).json({ signedOut: true });
});

authRouter.post(
  '/password-reset/request',
  rateLimitWithFallback(magicLimiter, { windowMs: 15 * 60 * 1000, max: 3, keyPrefix: 'pw-reset-req' }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = RequestPasswordResetSchema.parse(req.body);
      const result = await requestPasswordReset(input, {
        ipAddress: getClientIp(req),
        userAgent: req.headers['user-agent'],
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
);

authRouter.post(
  '/password-reset/consume',
  rateLimitWithFallback(authLimiter, { windowMs: 15 * 60 * 1000, max: 5, keyPrefix: 'pw-reset-consume' }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = ConsumePasswordResetSchema.parse(req.body);
      const result = await consumePasswordReset(input, {
        ipAddress: getClientIp(req),
        userAgent: req.headers['user-agent'] ?? null,
      });
      if (!result) {
        res.status(401).json({ error: 'InvalidOrExpiredToken' });
        return;
      }
      res.cookie(getSessionCookieName(), result.sessionToken, getSessionCookieOptions());
      res.status(200).json({
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
          emailVerified: result.user.emailVerified,
          agreementAcceptedAt: result.user.agreementAcceptedAt,
          defaultCampusId: result.user.defaultCampusId,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

authRouter.post(
  '/accept-agreement',
  requireAuth,
  rateLimitWithFallback(agreementLimiter, { windowMs: 60 * 60 * 1000, max: 10, keyPrefix: 'agreement' }),
  async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      const input = AcceptAgreementSchema.parse(req.body);
      const user = await acceptAgreement(req.userId!, input.version, {
        ipAddress: getClientIp(req),
        userAgent: req.headers['user-agent'],
      });
      res.status(200).json({ accepted: true, user });
    } catch (error) {
      next(error);
    }
  },
);

authRouter.get('/google', (_req: Request, res: Response) => {
  const redirectUri = `${env.WEB_URL}/api/auth/google/callback`;
  const intent = (_req.query.intent as string) || 'buyer';
  const params = new URLSearchParams({
    client_id: env.AUTH_GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
    // Carry intent through the OAuth round-trip via state (URL-encoded).
    state: encodeURIComponent(JSON.stringify({ intent })),
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
});

authRouter.get('/google/callback', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const code = req.query.code as string;
    if (!code) {
      res.status(400).json({ error: 'MissingCode' });
      return;
    }
    // Recover signup intent from OAuth state (set on the /google entry route).
    let intent: 'buyer' | 'vendor' = 'buyer';
    try {
      const stateRaw = req.query.state as string;
      if (stateRaw) {
        const parsed = JSON.parse(decodeURIComponent(stateRaw)) as { intent?: string };
        if (parsed.intent === 'vendor') intent = 'vendor';
      }
    } catch {
      // ignore malformed state; default to buyer
    }
    const redirectUri = `${env.WEB_URL}/api/auth/google/callback`;
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: env.AUTH_GOOGLE_CLIENT_ID,
        client_secret: env.AUTH_GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });
    const tokens = (await tokenRes.json()) as { access_token?: string; error?: string };
    if (!tokens.access_token) {
      res.status(401).json({ error: 'GoogleAuthFailed' });
      return;
    }
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const profile = (await profileRes.json()) as { id: string; email: string; name?: string; picture?: string };
    if (!profile.email) {
      res.status(401).json({ error: 'GoogleNoEmail' });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { email: profile.email } });
    let user = existing;
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: profile.email,
          name: profile.name ?? null,
          image: profile.picture ?? null,
          hasGoogle: true,
          role: intent === 'vendor' ? 'vendor' : 'buyer',
          status: 'active',
          emailVerified: new Date(),
          agreementVersion: CURRENT_AGREEMENT_VERSION,
          agreementAcceptedAt: new Date(),
        },
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          hasGoogle: true,
          image: user.image ?? profile.picture ?? null,
          emailVerified: user.emailVerified ?? new Date(),
          lastSignInAt: new Date(),
          // Record TOS acceptance on first Google sign-in if not already done.
          ...(user.agreementAcceptedAt
            ? {}
            : {
                agreementVersion: CURRENT_AGREEMENT_VERSION,
                agreementAcceptedAt: new Date(),
              }),
        },
      });
    }

    // OAuth vendor signup: guarantee the Vendor row exists atomically (mirrors
    // /upgrade). Without this an OAuth vendor (intent=vendor) gets role='vendor'
    // but no Vendor row, breaking onboarding. Buyers must not get a row.
    if (user.role === 'vendor') {
      await ensureVendorRow(user.id);
    }

    const sessionToken = await issueSession(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      {
        ipAddress: getClientIp(req),
        userAgent: req.headers['user-agent'] ?? null,
      },
    );

    // web app runs on voeq.ng. Setting the session cookie here would scope it
    // to the API domain, so the web app never receives it and the user lands
    // unauthenticated. Instead we hand the signed token to the web via a query
    // param; the web route /api/auth/google/callback sets the cookie on the
    // correct (web) domain and then redirects to the role-based destination.
    const vendor = await prisma.vendor.findUnique({
      where: { userId: user.id },
      select: { status: true },
    });
    const dest = safeRedirect(
      user.role === 'vendor'
        ? vendor?.status === 'live'
          ? '/vendor'
          : '/vendor/onboarding/step-1'
        : user.role === 'admin' || user.role === 'super_admin'
          ? '/admin'
          : '/home',
    );
    const sep = webAppUrl.includes('?') ? '&' : '?';
    res.redirect(`${webAppUrl}/api/auth/google/callback${sep}token=${encodeURIComponent(sessionToken)}&dest=${encodeURIComponent(dest)}`);
  } catch (error) {
    // Never emit a raw API error page to the browser. Send the user back to
    // the web app with an error flag so the UI can show a friendly message.
    logger.error({ error }, 'Google OAuth callback failed');
    res.redirect(`${webAppUrl}/signin?error=oauth`);
  }
});

authRouter.post('/logout-all', requireAuth, async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const cookieName = getSessionCookieName();

    const user = await prisma.user.findUnique({ where: { id: req.userId! } });
    let deletedCount = 0;
    if (user) {
      // Revoke EVERY server-persisted session for this user (true logout-everywhere),
      // including the current device. Each API request re-checks the Session row,
      // so revoking here instantly invalidates the JWT on every device.
      deletedCount = await revokeAllUserSessions(user.id);
    }

    // Clear the current session cookie too.
    res.clearCookie(cookieName, { path: '/' });
    res.status(200).json({ loggedOut: true, revokedSessions: deletedCount });
  } catch (error) {
    next(error);
  }
});
