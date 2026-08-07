import { Router, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { type AdminRequest } from '../../middleware/admin';
import { logAdminAction } from '../../middleware/audit';
import { prisma } from '../../lib/db';
import type { Prisma } from '@prisma/client';

export const featuresRouter: ReturnType<typeof Router> = Router();

const updateSchema = z.object({
  value: z.unknown(),
  description: z.string().optional(),
});

featuresRouter.get('/', async (_req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const flags = await prisma.featureFlag.findMany({ orderBy: { key: 'asc' } });
    res.status(200).json({ flags });
  } catch (error) {
    next(error);
  }
});

featuresRouter.patch('/:key', async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const input = updateSchema.parse(req.body);
    const old = await prisma.featureFlag.findUnique({ where: { key: req.params.key ?? '' } });
    if (!old) {
      res.status(404).json({ error: 'NotFound' });
      return;
    }
    const safeValue = input.value as unknown as Prisma.InputJsonValue;
    const updated = await prisma.featureFlag.update({
      where: { key: old.key },
      data: { value: safeValue, description: input.description, updatedBy: req.userId },
    });
    await logAdminAction(req, 'feature_flag.updated', 'feature_flag', old.key, { old: old.value, new: input.value });
    res.status(200).json({ flag: updated });
  } catch (error) {
    next(error);
  }
});
