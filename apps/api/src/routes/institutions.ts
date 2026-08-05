import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '@voeq/db';

export const institutionsRouter: ReturnType<typeof Router> = Router();

institutionsRouter.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const institutions = await prisma.institution.findMany({
      where: { status: 'approved' },
      orderBy: { name: 'asc' },
      include: {
        campuses: {
          where: { isActive: true },
          orderBy: { isPrimary: 'desc' },
          select: { id: true, name: true, isPrimary: true },
        },
      },
    });
    res.status(200).json({ institutions });
  } catch (error) {
    next(error);
  }
});

const searchSchema = z.object({
  q: z.string().min(1).max(100),
  limit: z.coerce.number().int().positive().max(20).default(10),
});

institutionsRouter.get('/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = searchSchema.parse(req.query);
    const institutions = await prisma.institution.findMany({
      where: {
        status: 'approved',
        name: { contains: params.q, mode: 'insensitive' },
      },
      orderBy: { name: 'asc' },
      take: params.limit,
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        campuses: {
          where: { isActive: true },
          orderBy: { isPrimary: 'desc' },
          take: 5,
          select: { id: true, name: true, isPrimary: true },
        },
      },
    });
    res.status(200).json({ institutions });
  } catch (error) {
    next(error);
  }
});
