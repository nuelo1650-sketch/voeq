import { Router, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { type AdminRequest } from '../../middleware/admin';
import { prisma } from '../../lib/db';

export const categoriesRouter: ReturnType<typeof Router> = Router();

const updateSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  iconName: z.string().min(1).max(50).optional(),
  description: z.string().max(500).optional(),
  displayOrder: z.number().int().nonnegative().optional(),
  isActive: z.boolean().optional(),
  isOfficial: z.boolean().optional(),
  imageUrl: z.string().url().optional(),
  imagePublicId: z.string().max(200).optional(),
});

categoriesRouter.get('/', async (_req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { displayOrder: 'asc' },
      include: { _count: { select: { listings: { where: { status: 'active', deletedAt: null } } } } },
    });
    res.status(200).json({ categories });
  } catch (error) {
    next(error);
  }
});

categoriesRouter.patch('/:id', async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const input = updateSchema.parse(req.body);
    const category = await prisma.category.findUnique({ where: { id: req.params.id ?? '' } });
    if (!category) {
      res.status(404).json({ error: 'NotFound' });
      return;
    }
    const updated = await prisma.category.update({
      where: { id: category.id },
      data: input,
    });
    res.status(200).json({ category: updated });
  } catch (error) {
    next(error);
  }
});
