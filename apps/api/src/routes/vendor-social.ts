import { Router, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { requireAuth, type AuthedRequest } from '../middleware/auth';
import { prisma } from '../lib/db';

export const vendorSocialRouter: ReturnType<typeof Router> = Router();

const updateSocialSchema = z.object({
  instagramHandle: z.string().max(50).nullable().optional(),
  tiktokHandle: z.string().max(50).nullable().optional(),
  twitterHandle: z.string().max(50).nullable().optional(),
  facebookPage: z.string().url().max(200).nullable().optional(),
  linkedinProfile: z.string().url().max(200).nullable().optional(),
  websiteUrl: z.string().url().max(200).nullable().optional(),
});

vendorSocialRouter.patch('/me/social', requireAuth, async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const input = updateSocialSchema.parse(req.body);

    const vendor = await prisma.vendor.findUnique({ where: { userId: req.userId! } });
    if (!vendor) {
      res.status(404).json({ error: 'NotFound' });
      return;
    }

    const updated = await prisma.vendor.update({ where: { id: vendor.id }, data: input });
    res.status(200).json({ vendor: updated });
  } catch (error) {
    next(error);
  }
});
