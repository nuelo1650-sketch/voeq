import { Router, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { type AdminRequest } from '../../middleware/admin';
import { logAdminAction } from '../../middleware/audit';
import { prisma } from '../../lib/db';

export const reviewsRouter: ReturnType<typeof Router> = Router();

reviewsRouter.get('/', async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const where: Record<string, unknown> = {};
    if (req.query.status) where.status = req.query.status;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          vendor: { select: { businessName: true, businessSlug: true } },
          user: { select: { name: true, email: true } },
        },
      }),
      prisma.review.count({ where }),
    ]);
    res.status(200).json({ reviews, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
});

const moderateSchema = z.object({
  action: z.enum(['hide', 'delete', 'restore']),
  reason: z.string().min(5).max(500),
});

reviewsRouter.post('/:id/moderate', async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const input = moderateSchema.parse(req.body);
    const review = await prisma.review.findUnique({ where: { id: req.params.id ?? '' } });
    if (!review) {
      res.status(404).json({ error: 'NotFound' });
      return;
    }

    const newStatus = input.action === 'delete' ? 'deleted' : input.action === 'hide' ? 'hidden' : 'visible';
    const updated = await prisma.review.update({
      where: { id: review.id },
      data: { status: newStatus },
    });

    await logAdminAction(req, 'review.moderated', 'review', review.id, { action: input.action, reason: input.reason });
    res.status(200).json({ review: updated });
  } catch (error) {
    next(error);
  }
});
