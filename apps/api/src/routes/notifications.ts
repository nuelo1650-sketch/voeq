import { Router, type Response, type NextFunction } from 'express';
import { requireAuth, type AuthedRequest } from '../middleware/auth';
import { prisma } from '../lib/db';

export const notificationsRouter = Router();

notificationsRouter.get('/', requireAuth, async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const followedVendors = await prisma.follow.findMany({
      where: { userId: req.userId! },
      select: { vendorId: true },
    });

    const vendorIds = followedVendors.map((f) => f.vendorId);

    const recentReviews = await prisma.review.findMany({
      where: { vendorId: { in: vendorIds }, status: 'visible' },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        user: { select: { name: true, image: true } },
        vendor: { select: { businessName: true, businessSlug: true } },
      },
    });

    const notifications = recentReviews.map((review) => ({
      id: review.id,
      type: 'review',
      title: `New ${review.rating}-star review on ${review.vendor.businessName}`,
      body: review.text.slice(0, 100),
      vendorSlug: review.vendor.businessSlug,
      createdAt: review.createdAt,
      read: false,
    }));

    res.status(200).json({ notifications });
  } catch (error) {
    next(error);
  }
});
