import { Router, type Response, type NextFunction } from 'express';
import { requireSuperAdmin } from '../../middleware/admin';
import { type AdminRequest } from '../../middleware/admin';
import { prisma } from '@voeq/db';
import { syncAllVendorBadges } from '../../services/badge.service';

export const systemRouter: ReturnType<typeof Router> = Router();

systemRouter.get('/health', async (_req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const [userCount, vendorCount, listingCount, activeSessionCount, cronLastRun] = await Promise.all([
      prisma.user.count(),
      prisma.vendor.count({ where: { deletedAt: null } }),
      prisma.listing.count({ where: { deletedAt: null } }),
      prisma.session.count({ where: { expiresAt: { gt: new Date() } } }),
      prisma.auditLog.findFirst({
        where: { action: { in: ['cron.badges_synced', 'cron.tick'] } },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    res.status(200).json({
      db: { users: userCount, vendors: vendorCount, listings: listingCount },
      sessions: { active: activeSessionCount },
      cron: { lastRun: cronLastRun?.createdAt ?? null },
    });
  } catch (error) {
    next(error);
  }
});

systemRouter.post('/cron/trigger', requireSuperAdmin, async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const result = await syncAllVendorBadges();
    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
});
