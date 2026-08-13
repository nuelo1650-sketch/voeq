import { Router, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { requireAuth, type AuthedRequest } from '../middleware/auth';
import { rateLimit } from '../middleware/rate-limit';
import { prisma } from '../lib/db';

export const followRouter: ReturnType<typeof Router> = Router();

followRouter.post(
  '/',
  requireAuth,
  rateLimit({ windowMs: 60 * 1000, max: 30, keyPrefix: 'follow' }),
  async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      const { vendorId } = z.object({ vendorId: z.string().min(1) }).parse(req.body);

      const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
      if (!vendor) {
        res.status(404).json({ error: 'VendorNotFound' });
        return;
      }

      await prisma.follow.upsert({
        where: { userId_vendorId: { userId: req.userId!, vendorId } },
        create: { userId: req.userId!, vendorId },
        update: {},
      });

      res.status(200).json({ following: true });
    } catch (error) {
      next(error);
    }
  }
);

followRouter.delete(
  '/:vendorId',
  requireAuth,
  async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      const { vendorId } = req.params;
      if (!vendorId) {
        res.status(400).json({ error: 'VendorIdRequired' });
        return;
      }

      await prisma.follow.deleteMany({
        where: { userId: req.userId!, vendorId },
      });

      res.status(200).json({ following: false });
    } catch (error) {
      next(error);
    }
  }
);

followRouter.get('/following', requireAuth, async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const follows = await prisma.follow.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' },
      include: {
        vendor: {
          select: {
            id: true,
            businessName: true,
            businessSlug: true,
            description: true,
            profilePhotoPublicId: true,
            whatsappNumber: true,
            verifiedBadge: true,
            trustScore: true,
            ratingAvg: true,
            ratingCount: true,
            institution: { select: { name: true } },
            campus: { select: { name: true } },
            listings: {
              where: { status: 'active', deletedAt: null },
              take: 1,
              orderBy: { createdAt: 'desc' },
              include: {
                category: { select: { name: true, slug: true } },
                photos: { orderBy: { displayOrder: 'asc' }, take: 1, select: { url: true } },
              },
            },
          },
        },
      },
    });

    res.status(200).json({
      follows: follows.map((follow) => ({
        id: follow.id,
        vendorId: follow.vendor.id,
        vendor: {
          ...follow.vendor,
          slug: follow.vendor.businessSlug,
          profilePhotoUrl: follow.vendor.profilePhotoPublicId,
          listings: follow.vendor.listings.map((l) => ({
            id: l.id,
            slug: l.slug,
            title: l.title,
            description: l.description,
            priceMin: Number(l.priceMin),
            priceMax: l.priceMax ? Number(l.priceMax) : null,
            photoUrl: l.photos[0]?.url ?? null,
            categoryName: l.category?.name ?? 'Uncategorized',
            categorySlug: l.category?.slug ?? '',
          })),
        },
        createdAt: follow.createdAt,
      })),
    });
  } catch (error) {
    next(error);
  }
});
