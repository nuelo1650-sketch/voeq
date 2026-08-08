import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { requireAuth, type AuthedRequest } from '../middleware/auth';
import { rateLimit } from '../middleware/rate-limit';
import { prisma } from '../lib/db';

export const wishlistRouter = Router();

wishlistRouter.get('/', requireAuth, async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const items = await prisma.wishlistItem.findMany({
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
      items: items.map((item) => ({
        id: item.id,
        vendorId: item.vendor.id,
        vendor: {
          ...item.vendor,
          slug: item.vendor.businessSlug,
          profilePhotoUrl: item.vendor.profilePhotoPublicId,
          listings: item.vendor.listings.map((l) => ({
            id: l.id,
            slug: l.slug,
            title: l.title,
            description: l.description,
            priceMin: Number(l.priceMin),
            priceMax: l.priceMax ? Number(l.priceMax) : null,
            photoUrl: l.photos[0]?.url ?? null,
            categoryName: l.category.name,
            categorySlug: l.category.slug,
          })),
        },
        createdAt: item.createdAt,
      })),
    });
  } catch (error) {
    next(error);
  }
});

wishlistRouter.post(
  '/',
  requireAuth,
  rateLimit({ windowMs: 60 * 1000, max: 30, keyPrefix: 'wishlist-add' }),
  async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      const { vendorId } = z.object({ vendorId: z.string().min(1) }).parse(req.body);

      const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
      if (!vendor) {
        res.status(404).json({ error: 'VendorNotFound' });
        return;
      }

      await prisma.wishlistItem.upsert({
        where: { userId_vendorId: { userId: req.userId!, vendorId } },
        create: { userId: req.userId!, vendorId },
        update: {},
      });

      res.status(200).json({ added: true });
    } catch (error) {
      next(error);
    }
  }
);

wishlistRouter.delete(
  '/:vendorId',
  requireAuth,
  async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      const { vendorId } = req.params;
      if (!vendorId) {
        res.status(400).json({ error: 'VendorIdRequired' });
        return;
      }

      await prisma.wishlistItem.deleteMany({
        where: { userId: req.userId!, vendorId },
      });

      res.status(200).json({ removed: true });
    } catch (error) {
      next(error);
    }
  }
);
