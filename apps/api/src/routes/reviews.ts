import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import {
  CreateReviewSchema,
  UpdateReviewSchema,
  CreateVendorResponseSchema,
  UpdateVendorResponseSchema,
} from '../schemas/review';
import { requireAuth, optionalAuth, type AuthedRequest } from '../middleware/auth';
import { rateLimitWithFallback, reviewCreateLimiter, reviewRespondLimiter } from '../middleware/rate-limit-upstash';
import { prisma } from '../lib/db';
import {
  createReview,
  updateReview,
  deleteReview,
  addVendorResponse,
  updateVendorResponse,
  listVendorReviews,
  listMyReviews,
} from '../services/review.service';
import { logEvent } from '../services/analytics.service';
import { notify } from '../services/notification.service';
import { getClientIp } from '../utils/ip';

export const reviewsRouter: ReturnType<typeof Router> = Router();

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
});

reviewsRouter.get('/vendor/:vendorId', optionalAuth, async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const params = listQuerySchema.parse(req.query);
    const result = await listVendorReviews(req.params.vendorId ?? '', params.page, params.limit, req.userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get('/me', requireAuth, async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const reviews = await listMyReviews(req.userId!);
    res.status(200).json({ reviews });
  } catch (error) {
    next(error);
  }
});

reviewsRouter.post(
  '/vendor/:vendorId',
  requireAuth,
  rateLimitWithFallback(reviewCreateLimiter, { windowMs: 60 * 60 * 1000, max: 5, keyPrefix: 'review-create' }),
  async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      const input = CreateReviewSchema.parse(req.body);
      const result = await createReview(req.params.vendorId ?? '', req.userId!, input);

      // Notify the vendor owner of a new review (fire-and-forget).
      const [vendor, reviewer] = await Promise.all([
        prisma.vendor.findUnique({ where: { id: req.params.vendorId ?? '' }, select: { userId: true, businessName: true } }),
        prisma.user.findUnique({ where: { id: req.userId! }, select: { name: true } }),
      ]);
      if (vendor?.userId) {
        await notify({
          userId: vendor.userId,
          type: 'new_review',
          payload: {
            reviewId: result.review.id,
            rating: input.rating,
            reviewerName: reviewer?.name ?? 'A shopper',
            vendorId: req.params.vendorId,
            vendorName: vendor.businessName,
            listingId: input.listingId ?? null,
          },
        });
      }

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

reviewsRouter.delete(
  '/:id',
  requireAuth,
  async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      const result = await deleteReview(req.params.id ?? '', req.userId!);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
);

reviewsRouter.post(
  '/:id/respond',
  requireAuth,
  rateLimitWithFallback(reviewRespondLimiter, { windowMs: 60 * 60 * 1000, max: 20, keyPrefix: 'review-respond' }),
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

      // Notify the original reviewer that the vendor responded (fire-and-forget).
      const review = await prisma.review.findUnique({
        where: { id: req.params.id ?? '' },
        include: {
          user: { select: { id: true, name: true } },
          vendor: { select: { businessName: true } },
        },
      });
      if (review?.user?.id) {
        await notify({
          userId: review.user.id,
          type: 'review_response',
          payload: {
            reviewId: review.id,
            vendorId: review.vendorId,
            vendorName: review.vendor?.businessName ?? 'The vendor',
            reviewerName: review.user.name,
          },
        });
      }

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

const commentSchema = z.object({ content: z.string().min(1).max(1000) });

// Review interactions
reviewsRouter.get('/:reviewId/comments', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reviewId } = req.params;
    if (!reviewId) {
      res.status(400).json({ error: 'ReviewIdRequired' });
      return;
    }
    const comments = await prisma.reviewComment.findMany({
      where: { reviewId },
      orderBy: { createdAt: 'asc' },
      include: { author: { select: { name: true, image: true } } },
    });
    res.status(200).json({ comments });
  } catch (error) {
    next(error);
  }
});

reviewsRouter.post('/:reviewId/comments', requireAuth, async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const { reviewId } = req.params;
    if (!reviewId) {
      res.status(400).json({ error: 'ReviewIdRequired' });
      return;
    }
    const { content } = commentSchema.parse(req.body);

    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review || review.status !== 'visible') {
      res.status(404).json({ error: 'NotFound' });
      return;
    }

    const comment = await prisma.reviewComment.create({
      data: { reviewId, authorId: req.userId!, content },
      include: { author: { select: { name: true, image: true } } },
    });

    res.status(201).json({ comment });
  } catch (error) {
    next(error);
  }
});

reviewsRouter.post('/:reviewId/like', requireAuth, async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const { reviewId } = req.params;
    if (!reviewId) {
      res.status(400).json({ error: 'ReviewIdRequired' });
      return;
    }

    const existing = await prisma.reviewLike.findUnique({
      where: { reviewId_userId: { reviewId, userId: req.userId! } },
    });

    if (existing) {
      await prisma.reviewLike.delete({ where: { id: existing.id } });
      res.status(200).json({ liked: false });
    } else {
      await prisma.reviewLike.create({ data: { reviewId, userId: req.userId! } });
      res.status(200).json({ liked: true });
    }
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get('/:reviewId/likes', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reviewId } = req.params;
    if (!reviewId) {
      res.status(400).json({ error: 'ReviewIdRequired' });
      return;
    }
    const count = await prisma.reviewLike.count({ where: { reviewId } });
    res.status(200).json({ count });
  } catch (error) {
    next(error);
  }
});
