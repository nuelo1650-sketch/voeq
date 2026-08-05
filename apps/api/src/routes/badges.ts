import { Router, type Request, type Response, type NextFunction } from 'express';
import { prisma } from '@voeq/db';
import { BADGE_DEFINITIONS } from '../services/badge.service';

export const badgesRouter: ReturnType<typeof Router> = Router();

badgesRouter.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ badges: Object.values(BADGE_DEFINITIONS) });
  } catch (error) {
    next(error);
  }
});

badgesRouter.get('/vendor/:vendorId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const badges = await prisma.vendorBadge.findMany({
      where: {
        vendorId: req.params.vendorId ?? '',
        revokedAt: null,
      },
      orderBy: { earnedAt: 'asc' },
    });
    res.status(200).json({ badges });
  } catch (error) {
    next(error);
  }
});
