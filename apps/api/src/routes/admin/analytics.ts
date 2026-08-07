import { Router, type Response, type NextFunction } from 'express';
import { type AdminRequest } from '../../middleware/admin';
import { prisma } from '../../lib/db';

export const analyticsRouter: ReturnType<typeof Router> = Router();

analyticsRouter.get('/signups', async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const days = 30;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const signups = await prisma.user.groupBy({
      by: ['createdAt'],
      where: { createdAt: { gte: startDate }, deletedAt: null },
      _count: true,
    });

    const dailyCounts: Record<string, number> = {};
    for (let i = 0; i < days; i++) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const key = date.toISOString().split('T')[0]!;
      dailyCounts[key] = 0;
    }
    for (const signup of signups) {
      const key = signup.createdAt.toISOString().split('T')[0]!;
      dailyCounts[key] = (dailyCounts[key] ?? 0) + signup._count;
    }

    res.status(200).json({ data: Object.entries(dailyCounts).map(([date, count]) => ({ date, count })) });
  } catch (error) {
    next(error);
  }
});

analyticsRouter.get('/clicks-by-category', async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const events = await prisma.eventLog.findMany({
      where: { eventType: 'whatsapp_click', categoryId: { not: null } },
      select: { categoryId: true },
    });

    const counts: Record<string, number> = {};
    for (const event of events) {
      if (event.categoryId) {
        counts[event.categoryId] = (counts[event.categoryId] ?? 0) + 1;
      }
    }

    const categories = await prisma.category.findMany({
      where: { id: { in: Object.keys(counts) } },
      select: { id: true, name: true },
    });

    const data = categories
      .map((c) => ({ name: c.name, clicks: counts[c.id] ?? 0 }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);

    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});
