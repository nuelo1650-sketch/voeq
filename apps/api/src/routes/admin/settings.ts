import { Router, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { type AdminRequest } from '../../middleware/admin';
import { logAdminAction } from '../../middleware/audit';
import { prisma } from '../../lib/db';
import type { Prisma } from '@prisma/client';

export const settingsRouter: ReturnType<typeof Router> = Router();

const updateSchema = z.object({
  maintenanceMode: z.boolean().optional(),
  supportEmail: z.string().email().optional(),
  privacyEmail: z.string().email().optional(),
  vendorEmail: z.string().email().optional(),
  siteName: z.string().min(1).max(50).optional(),
});

settingsRouter.get('/', async (_req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const flag = await prisma.featureFlag.findUnique({ where: { key: 'site_settings' } });
    res.status(200).json({ settings: flag?.value ?? {} });
  } catch (error) {
    next(error);
  }
});

settingsRouter.patch('/', async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const input = updateSchema.parse(req.body);
    const safeValue = input as any;
    const updated = await prisma.featureFlag.upsert({
      where: { key: 'site_settings' },
      create: { key: 'site_settings', value: safeValue, updatedBy: req.userId },
      update: { value: safeValue, updatedBy: req.userId },
    });
    await logAdminAction(req, 'settings.updated', 'settings', undefined, { changes: input });
    res.status(200).json({ settings: updated.value });
  } catch (error) {
    next(error);
  }
});
