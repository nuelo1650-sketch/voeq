import { Router, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { type AdminRequest } from '../../middleware/admin';
import { logAdminAction } from '../../middleware/audit';
import { prisma } from '../../lib/db';
import { SignJWT } from 'jose';
import { env } from '../../config/env';
import { getSessionCookieName, getSessionCookieOptions } from '../../services/session.service';

export const impersonateRouter: ReturnType<typeof Router> = Router();

const startSchema = z.object({
  userId: z.string().min(1),
  duration: z.enum(['1h', '4h', '24h']),
  reason: z.string().min(20).max(500),
});

const DURATION_MS = {
  '1h': 60 * 60 * 1000,
  '4h': 4 * 60 * 60 * 1000,
  '24h': 24 * 60 * 60 * 1000,
};

impersonateRouter.post('/start', async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const input = startSchema.parse(req.body);
    const target = await prisma.user.findUnique({ where: { id: input.userId } });
    if (!target) {
      res.status(404).json({ error: 'NotFound' });
      return;
    }
    if (target.role === 'super_admin') {
      res.status(403).json({ error: 'CannotImpersonateSuperAdmin' });
      return;
    }

    const expiresAt = new Date(Date.now() + DURATION_MS[input.duration]);
    const secret = new TextEncoder().encode(env.AUTH_SECRET);

    const token = await new SignJWT({
      email: target.email,
      role: target.role,
      impersonatedBy: req.userId,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(target.id)
      .setIssuedAt()
      .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
      .sign(secret);

    await prisma.session.create({
      data: {
        userId: target.id,
        tokenHash: await import('node:crypto').then((c) => c.createHash('sha256').update(token).digest('hex')),
        expiresAt,
        impersonatedBy: req.userId,
        userAgent: typeof req.headers['user-agent'] === 'string' ? (req.headers['user-agent'] as string) : undefined,
        ipAddress: req.ip,
      },
    });

    await prisma.user.update({
      where: { id: target.id },
      data: { lastAdminImpersonationAt: new Date() },
    });

    await logAdminAction(req, 'user.impersonate_started', 'user', target.id, {
      targetEmail: target.email,
      duration: input.duration,
      reason: input.reason,
    });

    res.cookie(getSessionCookieName(), token, getSessionCookieOptions());
    res.status(200).json({ token, expiresAt });
  } catch (error) {
    next(error);
  }
});

impersonateRouter.post('/end', async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.impersonatedBy) {
      res.status(400).json({ error: 'NotImpersonating' });
      return;
    }

    res.clearCookie(getSessionCookieName(), { path: '/' });

    await prisma.session.deleteMany({
      where: {
        userId: req.userId!,
        impersonatedBy: req.impersonatedBy,
      },
    });

    await logAdminAction(req, 'user.impersonate_ended', 'user', req.userId, {});
    res.status(200).json({ ended: true });
  } catch (error) {
    next(error);
  }
});
