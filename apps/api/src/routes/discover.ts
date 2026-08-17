import { Router, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/db';

export const discoverRouter: ReturnType<typeof Router> = Router();

const trendingQuery = z.object({
  campusId: z.string().min(1),
  limit: z.coerce.number().int().positive().max(20).default(8),
});

discoverRouter.get('/trending', async (req: import('express').Request, res: Response, next: NextFunction) => {
  try {
    const { campusId, limit } = trendingQuery.parse(req.query);
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Raw view events for this campus over the last 7 days.
    const events = await prisma.eventLog.findMany({
      where: {
        eventType: { in: ['listing_view', 'vendor_view'] },
        campusId,
        createdAt: { gte: since },
      },
      select: { listingId: true, vendorId: true },
    });

    const listingCounts = new Map<string, number>();
    const vendorCounts = new Map<string, number>();
    for (const e of events) {
      if (e.listingId) listingCounts.set(e.listingId, (listingCounts.get(e.listingId) ?? 0) + 1);
      if (e.vendorId) vendorCounts.set(e.vendorId, (vendorCounts.get(e.vendorId) ?? 0) + 1);
    }

    // Rank listings and vendors by view count, then merge by score.
    const rankedListings = [...listingCounts.entries()].sort((a, b) => b[1] - a[1]);
    const rankedVendors = [...vendorCounts.entries()].sort((a, b) => b[1] - a[1]);

    const topListingIds = rankedListings.slice(0, limit).map(([id]) => id);
    const topVendorIds = rankedVendors.slice(0, limit).map(([id]) => id);

    const [listings, vendors] = await Promise.all([
      topListingIds.length
        ? prisma.listing.findMany({
            where: { id: { in: topListingIds }, status: 'active', deletedAt: null },
            include: {
              category: { select: { name: true, slug: true } },
              photos: { orderBy: { displayOrder: 'asc' }, take: 1, select: { url: true } },
            },
          })
        : Promise.resolve([]),
      topVendorIds.length
        ? prisma.vendor.findMany({
            where: { id: { in: topVendorIds }, status: 'live' },
            select: { id: true, businessName: true, businessSlug: true, profilePhotoPublicId: true },
          })
        : Promise.resolve([]),
    ]);

    const listingScore = new Map(rankedListings);
    const vendorScore = new Map(rankedVendors);

    const listingResults = listings.map((l) => ({
      kind: 'listing' as const,
      id: l.id,
      title: l.title,
      slug: l.slug,
      photoUrl: l.photos[0]?.url ?? null,
      categoryName: l.category?.name ?? null,
      categorySlug: l.category?.slug ?? null,
      views: listingScore.get(l.id) ?? 0,
    }));

    const vendorResults = vendors.map((v) => ({
      kind: 'vendor' as const,
      id: v.id,
      title: v.businessName,
      slug: v.businessSlug,
      photoUrl: v.profilePhotoPublicId,
      categoryName: null,
      categorySlug: null,
      views: vendorScore.get(v.id) ?? 0,
    }));

    const merged = [...listingResults, ...vendorResults]
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);

    res.status(200).json({ items: merged, windowDays: 7 });
  } catch (error) {
    next(error);
  }
});
