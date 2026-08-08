import { Router, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { requireAuth, type AuthedRequest } from '../middleware/auth';
import { prisma } from '../lib/db';

export const preferencesRouter: ReturnType<typeof Router> = Router();

const updateSchema = z.object({
  emailMarketing: z.boolean().optional(),
  emailReviews: z.boolean().optional(),
  emailNewsletter: z.boolean().optional(),
  notifyNewListings: z.boolean().optional(),
  notifyNewReviews: z.boolean().optional(),
  notifyNewFollowers: z.boolean().optional(),
  notifyDisputes: z.boolean().optional(),
});

preferencesRouter.get('/me', requireAuth, async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    let prefs = await prisma.userPreference.findUnique({ where: { userId: req.userId! } });
    if (!prefs) {
      prefs = await prisma.userPreference.create({ data: { userId: req.userId! } });
    }
    res.status(200).json({ preferences: prefs });
  } catch (error) {
    next(error);
  }
});

preferencesRouter.patch('/me', requireAuth, async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const input = updateSchema.parse(req.body);

    const prefs = await prisma.userPreference.upsert({
      where: { userId: req.userId! },
      create: { userId: req.userId!, ...input },
      update: input,
    });

    res.status(200).json({ preferences: prefs });
  } catch (error) {
    next(error);
  }
});

const deleteSchema = z.object({ confirm: z.literal('DELETE MY ACCOUNT') });

preferencesRouter.delete('/me', requireAuth, async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const { confirm } = deleteSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { id: req.userId! } });
    if (!user) {
      res.status(404).json({ error: 'NotFound' });
      return;
    }

    await prisma.user.update({ where: { id: req.userId! }, data: { deletedAt: new Date(), status: 'suspended' } });
    await prisma.session.deleteMany({ where: { userId: req.userId! } });

    res.status(200).json({ deleted: true });
  } catch (error) {
    next(error);
  }
});
