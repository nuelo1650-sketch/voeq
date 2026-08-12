import { Router, type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../lib/db';

export const statsRouter: ReturnType<typeof Router> = Router();

statsRouter.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [institutions, categories, vendors, listings] = await Promise.all([
      prisma.institution.count({ where: { status: 'approved' } }),
      prisma.category.count({ where: { isActive: true } }),
      prisma.vendor.count({ where: { status: 'live' } }),
      prisma.listing.count({ where: { status: 'active' } }),
    ]);

    res.status(200).json({
      stats: {
        institutions,
        categories,
        vendors,
        listings,
      },
    });
  } catch (error) {
    next(error);
  }
});
