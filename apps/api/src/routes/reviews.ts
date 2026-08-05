import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import {
  CreateReviewSchema,
  UpdateReviewSchema,
  CreateVendorResponseSchema,
  UpdateVendorResponseSchema,
} from '../schemas/review';
import { requireAuth, type AuthedRequest } from '../middleware/auth';
import { rateLimit } from '../middleware/rate-limit';
import { prisma } from '@voeq/db';
import {
  createReview,
  updateReview,
  addVendorResponse,
  updateVendorResponse,
  listVendorReviews,
} from '../services/review.service';
import { logEvent } from '../services/analytics.service';
import { getClientIp } from '../utils/ip';

export const reviewsRouter: ReturnType<typeof Router> = Router();

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
});

reviewsRouter.get('/vendor/:vendorId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = listQuerySchema.parse(req.query);
    const result = await listVendorReviews(req.params.vendorId ?? '', params.page, params.limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

reviewsRouter.post(
  '/vendor/:vendorId',
  requireAuth,
  rateLimit({ windowMs: 60 * 60 * 1000, max: 5, keyPrefix: 'review-create' }),
  async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      const input = CreateReviewSchema.parse(req.body);
      const result = await createReview(req.params.vendorId ?? '', req.userId!, input);

      await logEvent({
        eventType: 'review_submitted',
        userId: req.userId,
        vendorId: req.params.vendorId,
        metadata: { rating: input.rating },
        ipAddress: getClientIp(req),
        userAgent: req.headers['user-agent'],
      });

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },
);

reviewsRouter.patch(
  '/:id',
  requireAuth,
  async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      const input = UpdateReviewSchema.parse(req.body);
      const result = await updateReview(req.params.id ?? '', req.userId!, input);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
);

reviewsRouter.post(
  '/:id/respond',
  requireAuth,
  rateLimit({ windowMs: 60 * 60 * 1000, max: 20, keyPrefix: 'review-respond' }),
  async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      const input = CreateVendorResponseSchema.parse(req.body);

      const vendor = await prisma.vendor.findUnique({
        where: { userId: req.userId! },
        select: { id: true },
      });
      if (!vendor) {
        res.status(403).json({ error: 'NotAVendor' });
        return;
      }

      const result = await addVendorResponse(req.params.id ?? '', vendor.id, input.text);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
);

reviewsRouter.patch(
  '/:id/respond',
  requireAuth,
  async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      const input = UpdateVendorResponseSchema.parse(req.body);

      const vendor = await prisma.vendor.findUnique({
        where: { userId: req.userId! },
        select: { id: true },
      });
      if (!vendor) {
        res.status(403).json({ error: 'NotAVendor' });
        return;
      }

      const result = await updateVendorResponse(req.params.id ?? '', vendor.id, input.text);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
);
