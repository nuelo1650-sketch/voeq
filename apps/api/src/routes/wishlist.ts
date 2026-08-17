import { Router, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { requireAuth, optionalAuth, type AuthedRequest } from '../middleware/auth';
import { rateLimitWithFallback, writeLimiter } from '../middleware/rate-limit-upstash';
import { prisma } from '../lib/db';

export const wishlistRouter: ReturnType<typeof Router> = Router();

wishlistRouter.get('/check', requireAuth, async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const { listingId, vendorId } = removeSchema.parse(req.query);
    const where = vendorId
      ? { userId: req.userId!, vendorId }
      : { userId: req.userId!, listingId: listingId! };
    const existing = await prisma.wishlistItem.findFirst({ where, select: { id: true } });
    res.status(200).json({ saved: Boolean(existing) });
  } catch (error) {
    next(error);
  }
});

wishlistRouter.get('/', requireAuth, async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const items = await prisma.wishlistItem.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        vendorId: true,
        listingId: true,
        createdAt: true,
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
        listing: {
          select: {
            id: true,
            slug: true,
            title: true,
            description: true,
            priceMin: true,
            priceMax: true,
            status: true,
            deletedAt: true,
            vendor: {
              select: {
                id: true,
                businessName: true,
                businessSlug: true,
                campus: { select: { name: true } },
              },
            },
            photos: { orderBy: { displayOrder: 'asc' }, take: 1, select: { url: true } },
            category: { select: { name: true, slug: true } },
          },
        },
      },
    });

    const normalized = items.map((item) => {
      if (item.listingId && item.listing) {
        const l = item.listing;
        return {
          kind: 'listing' as const,
          id: item.id,
          listingId: l.id,
          createdAt: item.createdAt,
          listing: {
            id: l.id,
            slug: l.slug,
            title: l.title,
            description: l.description,
            priceMin: Number(l.priceMin),
            priceMax: l.priceMax ? Number(l.priceMax) : null,
            photoUrl: l.photos[0]?.url ?? null,
            categoryName: l.category?.name ?? 'Uncategorized',
            categorySlug: l.category?.slug ?? '',
            vendorName: l.vendor.businessName,
            vendorSlug: l.vendor.businessSlug,
            campusName: l.vendor.campus?.name ?? null,
          },
        };
      }
      const v = item.vendor!;
      return {
        kind: 'vendor' as const,
        id: item.id,
        vendorId: v.id,
        createdAt: item.createdAt,
        vendor: {
          ...v,
          slug: v.businessSlug,
          profilePhotoUrl: v.profilePhotoPublicId,
          listings: v.listings.map((l) => ({
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
      };
    });

    res.status(200).json({ items: normalized });
  } catch (error) {
    next(error);
  }
});

const addSchema = z
  .object({ vendorId: z.string().min(1) })
  .or(z.object({ listingId: z.string().min(1) }));

wishlistRouter.post(
  '/',
  requireAuth,
  rateLimitWithFallback(writeLimiter, { windowMs: 60 * 1000, max: 30, keyPrefix: 'wishlist-add' }),
  async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      const body = addSchema.parse(req.body);
      const data =
        'vendorId' in body
          ? { userId: req.userId!, vendorId: body.vendorId }
          : { userId: req.userId!, listingId: body.listingId };

      const targetId = 'vendorId' in body ? body.vendorId : body.listingId;

      if ('vendorId' in body) {
        const vendor = await prisma.vendor.findUnique({ where: { id: targetId } });
        if (!vendor) {
          res.status(404).json({ error: 'VendorNotFound' });
          return;
        }
      } else {
        const listing = await prisma.listing.findUnique({ where: { id: targetId } });
        if (!listing) {
          res.status(404).json({ error: 'ListingNotFound' });
          return;
        }
      }

      await prisma.wishlistItem.upsert({
        where:
          'vendorId' in body
            ? { userId_vendorId: { userId: req.userId!, vendorId: body.vendorId } }
            : { userId_listingId: { userId: req.userId!, listingId: body.listingId } },
        create: data,
        update: {},
      });

      res.status(200).json({ added: true });
    } catch (error) {
      next(error);
    }
  },
);

const removeSchema = z
  .object({ vendorId: z.string().min(1).optional(), listingId: z.string().min(1).optional() })
  .refine((v) => Boolean(v.vendorId) !== Boolean(v.listingId), {
    message: 'Exactly one of vendorId or listingId is required',
  });

wishlistRouter.delete('/', requireAuth, async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const { vendorId, listingId } = removeSchema.parse(req.query);
    const where = vendorId
      ? { userId: req.userId!, vendorId }
      : { userId: req.userId!, listingId: listingId! };

    await prisma.wishlistItem.deleteMany({ where });
    res.status(200).json({ removed: true });
  } catch (error) {
    next(error);
  }
});
