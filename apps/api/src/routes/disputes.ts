import { Router, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { requireAuth, type AuthedRequest } from '../middleware/auth';
import { prisma } from '../lib/db';

export const disputesRouter: ReturnType<typeof Router> = Router();

const createDisputeSchema = z.object({
  vendorId: z.string().min(1),
  listingId: z.string().optional(),
  reason: z.string().min(10).max(100),
  details: z.string().max(1000).optional(),
});

disputesRouter.post('/', requireAuth, async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const input = createDisputeSchema.parse(req.body);

    const vendor = await prisma.vendor.findUnique({ where: { id: input.vendorId } });
    if (!vendor) {
      res.status(404).json({ error: 'VendorNotFound' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: req.userId! } });
    if (!user) {
      res.status(404).json({ error: 'UserNotFound' });
      return;
    }

    const dispute = await prisma.dispute.create({
      data: {
        reporterId: req.userId!,
        vendorId: input.vendorId,
        listingId: input.listingId,
        reason: input.reason,
        details: input.details,
        status: 'open',
      },
      include: {
        vendor: { select: { businessName: true, businessSlug: true } },
      },
    });

    res.status(201).json({ dispute });
  } catch (error) {
    next(error);
  }
});

disputesRouter.get('/mine', requireAuth, async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const disputes = await prisma.dispute.findMany({
      where: { reporterId: req.userId! },
      orderBy: { createdAt: 'desc' },
      include: { vendor: { select: { businessName: true, businessSlug: true } } },
    });
    res.status(200).json({ disputes });
  } catch (error) {
    next(error);
  }
});
