import { Router, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { type AdminRequest } from '../../middleware/admin';
import { logAdminAction } from '../../middleware/audit';
import { prisma } from '@voeq/db';

export const listingsRouter: ReturnType<typeof Router> = Router();

listingsRouter.get('/', async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const where: Record<string, unknown> = { deletedAt: null };
    if (req.query.search) {
      where.title = { contains: req.query.search as string, mode: 'insensitive' };
    }
    if (req.query.status) where.status = req.query.status;

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: { select: { name: true } },
          vendor: { select: { businessName: true, businessSlug: true } },
        },
      }),
      prisma.listing.count({ where }),
    ]);
    res.status(200).json({ listings, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
});

const updateStatusSchema = z.object({
  status: z.enum(['active', 'paused', 'archived']),
  reason: z.string().min(10).max(500),
});

listingsRouter.post('/:id/update-status', async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const input = updateStatusSchema.parse(req.body);
    const listing = await prisma.listing.findUnique({ where: { id: req.params.id ?? '' } });
    if (!listing) {
      res.status(404).json({ error: 'NotFound' });
      return;
    }
    const updated = await prisma.listing.update({
      where: { id: listing.id },
      data: { status: input.status },
    });
    await logAdminAction(req, 'listing.status_updated', 'listing', listing.id, { status: input.status, reason: input.reason });
    res.status(200).json({ listing: updated });
  } catch (error) {
    next(error);
  }
});

listingsRouter.delete('/:id', async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const listing = await prisma.listing.findUnique({ where: { id: req.params.id ?? '' } });
    if (!listing) {
      res.status(404).json({ error: 'NotFound' });
      return;
    }
    const updated = await prisma.listing.update({
      where: { id: listing.id },
      data: { deletedAt: new Date(), status: 'archived' },
    });
    await logAdminAction(req, 'listing.deleted', 'listing', listing.id, { title: listing.title });
    res.status(200).json({ listing: updated });
  } catch (error) {
    next(error);
  }
});
