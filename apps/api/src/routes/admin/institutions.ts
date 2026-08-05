import { Router, type Response, type NextFunction } from 'express';
import { type AdminRequest } from '../../middleware/admin';
import { z } from 'zod';
import { prisma } from '@voeq/db';

export const institutionsRouter: ReturnType<typeof Router> = Router();

institutionsRouter.get('/', async (_req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const institutions = await prisma.institution.findMany({
      orderBy: [{ status: 'asc' }, { name: 'asc' }],
      include: {
        campuses: { orderBy: { isPrimary: 'desc' } },
        _count: { select: { vendors: { where: { deletedAt: null } } } },
      },
    });
    res.status(200).json({ institutions });
  } catch (error) {
    next(error);
  }
});

institutionsRouter.get('/pending', async (_req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const institutions = await prisma.institution.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'asc' },
    });
    res.status(200).json({ institutions });
  } catch (error) {
    next(error);
  }
});

const approveSchema = z.object({
  type: z.enum(['university', 'polytechnic', 'college', 'other']).optional(),
});

institutionsRouter.post('/:id/approve', async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const input = approveSchema.parse(req.body);
    const institution = await prisma.institution.findUnique({ where: { id: req.params.id ?? '' } });
    if (!institution) {
      res.status(404).json({ error: 'NotFound' });
      return;
    }
    const updated = await prisma.institution.update({
      where: { id: institution.id },
      data: {
        status: 'approved',
        approvedAt: new Date(),
        approvedBy: req.userId,
        source: 'seed',
        ...(input.type && { type: input.type }),
      },
    });
    res.status(200).json({ institution: updated });
  } catch (error) {
    next(error);
  }
});

institutionsRouter.post('/:id/reject', async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const institution = await prisma.institution.findUnique({ where: { id: req.params.id ?? '' } });
    if (!institution) {
      res.status(404).json({ error: 'NotFound' });
      return;
    }
    const updated = await prisma.institution.update({
      where: { id: institution.id },
      data: { status: 'rejected' },
    });
    res.status(200).json({ institution: updated });
  } catch (error) {
    next(error);
  }
});
