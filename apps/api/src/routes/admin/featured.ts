import { Router, type Response, type NextFunction } from 'express';
import { type AdminRequest } from '../../middleware/admin';
import { prisma } from '@voeq/db';

export const featuredRouter: ReturnType<typeof Router> = Router();

featuredRouter.get('/', async (_req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const featured = await prisma.vendor.findMany({
      where: { isFeatured: true, deletedAt: null },
      orderBy: { featuredUntil: 'asc' },
      include: { campus: { select: { name: true, institution: { select: { name: true } } } } },
    });
    res.status(200).json({ featured });
  } catch (error) {
    next(error);
  }
});
