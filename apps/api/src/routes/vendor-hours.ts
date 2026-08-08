import { Router, type Request, type Response, type NextFunction } from 'express';
import { requireAuth, type AuthedRequest } from '../middleware/auth';
import { prisma } from '../lib/db';
import { z } from 'zod';

export const vendorHoursRouter: ReturnType<typeof Router> = Router();

vendorHoursRouter.get('/:slug/is-open', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    if (!slug) {
      res.status(400).json({ error: 'SlugRequired' });
      return;
    }

    const vendor = await prisma.vendor.findUnique({
      where: { businessSlug: slug },
      select: { isAlwaysOpen: true, operatingHours: true, timezone: true },
    });

    if (!vendor) {
      res.status(200).json({ isOpen: false });
      return;
    }

    if (vendor.isAlwaysOpen) {
      res.status(200).json({ isOpen: true });
      return;
    }

    if (!vendor.operatingHours) {
      res.status(200).json({ isOpen: true });
      return;
    }

    const now = new Date();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[now.getDay()];
    if (!dayName) {
      res.status(200).json({ isOpen: false });
      return;
    }
    const hours = (vendor.operatingHours ?? {}) as Record<string, { open: string; close: string; closed?: boolean }>;
    const dayHours = hours[dayName];

    if (!dayHours || dayHours.closed) {
      res.status(200).json({ isOpen: false });
      return;
    }

    const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    const isOpen = currentTime >= dayHours.open && currentTime < dayHours.close;

    res.status(200).json({ isOpen, hours: dayHours });
  } catch (error) {
    next(error);
  }
});

vendorHoursRouter.patch('/me/hours', requireAuth, async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const updateHoursSchema = z.object({
      operatingHours: z.record(z.object({
        open: z.string().regex(/^\d{2}:\d{2}$/),
        close: z.string().regex(/^\d{2}:\d{2}$/),
        closed: z.boolean().optional(),
      })).optional(),
      isAlwaysOpen: z.boolean().optional(),
      timezone: z.string().optional(),
    });

    const input = updateHoursSchema.parse(req.body);

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
