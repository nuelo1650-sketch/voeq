import { Router, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/db';
import { requireAuth, type AuthedRequest } from '../middleware/auth';

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

// Recent distinct listings/vendors the current user viewed (last 14 days).
// Used by the shopper dashboard "Recently viewed" panel. Distinct by target,
// most-recent first.
discoverRouter.get('/recently-viewed', requireAuth, async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    const events = await prisma.eventLog.findMany({
      where: {
        userId: userId,
        eventType: { in: ['listing_view', 'vendor_view'] },
        createdAt: { gte: since },
      },
      orderBy: { createdAt: 'desc' },
      select: { listingId: true, vendorId: true, createdAt: true },
    });

    // Keep first (most recent) occurrence of each target.
    const seen = new Set<string>();
    const listingIds: string[] = [];
    const vendorIds: string[] = [];
    for (const e of events) {
      if (e.listingId && !seen.has('l:' + e.listingId)) {
        seen.add('l:' + e.listingId);
        listingIds.push(e.listingId);
      } else if (e.vendorId && !seen.has('v:' + e.vendorId)) {
        seen.add('v:' + e.vendorId);
        vendorIds.push(e.vendorId);
      }
    }

    const [listings, vendors] = await Promise.all([
      listingIds.length
        ? prisma.listing.findMany({
            where: { id: { in: listingIds }, status: 'active', deletedAt: null },
            include: {
              category: { select: { name: true, slug: true } },
              photos: { orderBy: { displayOrder: 'asc' }, take: 1, select: { url: true } },
            },
          })
        : Promise.resolve([]),
      vendorIds.length
        ? prisma.vendor.findMany({
            where: { id: { in: vendorIds }, status: 'live' },
            select: { id: true, businessName: true, businessSlug: true, profilePhotoPublicId: true },
          })
        : Promise.resolve([]),
    ]);

    const byListing = new Map(listings.map((l) => [l.id, l]));
    const byVendor = new Map(vendors.map((v) => [v.id, v]));

    const items: Array<{
      kind: 'listing' | 'vendor';
      id: string;
      title: string;
      slug: string;
      photoUrl: string | null;
      categoryName: string | null;
    }> = [];
    for (const e of events) {
      if (e.listingId && byListing.has(e.listingId)) {
        const l = byListing.get(e.listingId)!;
        items.push({
          kind: 'listing',
          id: l.id,
          title: l.title,
          slug: l.slug,
          photoUrl: (l.photos as Array<{ url: string }>)[0]?.url ?? null,
          categoryName: l.category?.name ?? null,
        });
        byListing.delete(e.listingId);
      } else if (e.vendorId && byVendor.has(e.vendorId)) {
        const v = byVendor.get(e.vendorId)!;
        items.push({
          kind: 'vendor',
          id: v.id,
          title: v.businessName,
          slug: v.businessSlug,
          photoUrl: v.profilePhotoPublicId,
          categoryName: null,
        });
        byVendor.delete(e.vendorId);
      }
      if (items.length >= 12) break;
    }

    res.status(200).json({ items });
  } catch (error) {
    next(error);
  }
});
