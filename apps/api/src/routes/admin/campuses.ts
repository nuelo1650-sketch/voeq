import { Router, type Response, type NextFunction } from 'express';
import { type AdminRequest } from '../../middleware/admin';
import { prisma } from '@voeq/db';

export const campusesRouter: ReturnType<typeof Router> = Router();

campusesRouter.get('/', async (_req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const campuses = await prisma.campus.findMany({
      orderBy: [{ institutionId: 'asc' }, { isPrimary: 'desc' }],
      include: { institution: { select: { name: true } } },
    });
    res.status(200).json({ campuses });
  } catch (error) {
    next(error);
  }
});
