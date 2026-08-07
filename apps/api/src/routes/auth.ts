import { Router, type Request, type Response, type NextFunction } from 'express';
import {
  SignupWithPasswordSchema,
  VerifyOtpSchema,
  SignInWithPasswordSchema,
  RequestMagicLinkSchema,
  AcceptAgreementSchema,
} from '../schemas/auth';
import {
  signUpWithPassword,
  verifyOtp,
  signInWithPassword,
  requestMagicLink,
  consumeMagicLink,
  acceptAgreement,
} from '../services/auth.service';
import { rateLimit } from '../middleware/rate-limit';
import { requireAuth, type AuthedRequest } from '../middleware/auth';
import { getClientIp } from '../utils/ip';
import { getSessionCookieName, getSessionCookieOptions } from '../services/session.service';
import { env } from '../config/env';
import { prisma } from '../lib/db';
import { issueSession } from '../services/session.service';

export const authRouter: ReturnType<typeof Router> = Router();

authRouter.post(
  '/signup/password',
  rateLimit({ windowMs: 15 * 60 * 1000, max: 5, keyPrefix: 'signup' }),
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
  rateLimit({ windowMs: 15 * 60 * 1000, max: 5, keyPrefix: 'otp' }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = VerifyOtpSchema.parse(req.body);
      const result = await verifyOtp(input);
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
  '/signin/password',
  rateLimit({ windowMs: 15 * 60 * 1000, max: 5, keyPrefix: 'signin' }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = SignInWithPasswordSchema.parse(req.body);
      const result = await signInWithPassword(input);
      if (!result) {
        res.status(401).json({ error: 'InvalidCredentials' });
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
  '/magic-link',
  rateLimit({ windowMs: 15 * 60 * 1000, max: 3, keyPrefix: 'magic' }),
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
  rateLimit({ windowMs: 15 * 60 * 1000, max: 5, keyPrefix: 'magic-consume' }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;
      if (typeof token !== 'string') {
        res.status(400).json({ error: 'TokenRequired' });
        return;
      }
      const result = await consumeMagicLink(token);
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

authRouter.post('/signout', (_req: Request, res: Response) => {
  res.clearCookie(getSessionCookieName(), { path: '/' });
  res.status(200).json({ signedOut: true });
});

authRouter.post(
  '/accept-agreement',
  requireAuth,
  rateLimit({ windowMs: 60 * 60 * 1000, max: 10, keyPrefix: 'agreement' }),
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
  const redirectUri = `${env.WEB_URL ?? 'http://localhost:3000'}/api/auth/callback/google`;
  const params = new URLSearchParams({
    client_id: env.AUTH_GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
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
    const redirectUri = `${env.WEB_URL ?? 'http://localhost:3000'}/api/auth/callback/google`;
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
          role: 'buyer',
          status: 'active',
          currentContext: 'buyer',
          emailVerified: new Date(),
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
        },
      });
    }

    const sessionToken = await issueSession({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    res.cookie(getSessionCookieName(), sessionToken, getSessionCookieOptions());
    const webUrl = env.WEB_URL ?? 'http://localhost:3000';
    res.redirect(`${webUrl}/home`);
  } catch (error) {
    next(error);
  }
});
