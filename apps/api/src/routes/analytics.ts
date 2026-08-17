import { Router, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { optionalAuth, type AuthedRequest } from '../middleware/auth';
import { logEvent } from '../services/analytics.service';
import { getClientIp } from '../utils/ip';

export const analyticsRouter: ReturnType<typeof Router> = Router();

const viewSchema = z.object({
  kind: z.enum(['listing', 'vendor']),
  id: z.string().min(1),
  campusId: z.string().min(1),
});

// Optional auth: count logged-out campus traffic too, but associate userId
// when a session is present. campusId is always required.
analyticsRouter.post(
  '/view',
  optionalAuth,
  async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      const input = viewSchema.parse(req.body);
      const eventType = input.kind === 'listing' ? 'listing_view' : 'vendor_view';

      await logEvent({
        eventType,
        userId: req.userId,
        campusId: input.campusId,
        ...(input.kind === 'listing' ? { listingId: input.id } : { vendorId: input.id }),
        ipAddress: getClientIp(req),
        userAgent: req.headers['user-agent'],
      });

      res.status(202).json({ ok: true });
    } catch (error) {
      next(error);
    }
  },
);
