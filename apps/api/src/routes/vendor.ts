import { Router, type Response, type NextFunction } from 'express';
import {
  UpdateVendorSchema,
  AcceptVendorAgreementSchema,
  CreateListingSchema,
  UpdateListingSchema,
} from '../schemas/vendor';
import { requireAuth, type AuthedRequest } from '../middleware/auth';
import { rateLimit } from '../middleware/rate-limit';
import { prisma } from '../lib/db';
import {
  generateUniqueVendorSlug,
  calculateOnboardingProgress,
  canGoLive,
  ensureVendorRow,
} from '../services/vendor.service';
import { getClientIp } from '../utils/ip';
import {
  createListing,
  updateListing,
  deleteListing,
  getVendorOwnListing,
} from '../services/listings.service';
import type { Prisma } from '@prisma/client';

export const vendorRouter: ReturnType<typeof Router> = Router();

vendorRouter.get('/me', requireAuth, async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { userId: req.userId! },
      include: {
        institution: { select: { id: true, name: true } },
        campus: { select: { id: true, name: true } },
        listings: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
          include: { photos: { take: 1, orderBy: { displayOrder: 'asc' } } },
        },
        _count: {
          select: {
            listings: { where: { status: 'active', deletedAt: null } },
            reviews: true,
          },
        },
      },
    });

    if (!vendor) {
      res.status(404).json({ error: 'NotFound', hasVendor: false });
      return;
    }

    const progress = await calculateOnboardingProgress(vendor, vendor.listings.length > 0);

    res.status(200).json({ vendor, progress });
  } catch (error) {
    next(error);
  }
});

/**
 * Promote the authenticated shopper (role buyer) to a vendor.
 *
 * This is the entry point for the "Become a vendor" flow: a buyer clicks
 * "Get started" on /become-vendor, the web calls this endpoint, and we
 * (a) set role='vendor', and (b) create the
 * Vendor subtree (if it does not already exist) so the onboarding forms
 * have something to read/write. Reuses the same create block as PATCH /me.
 *
 * Idempotent: if the user is already a vendor or already has a Vendor row,
 * it simply returns the existing vendor without erroring.
 */
vendorRouter.post(
  '/upgrade',
  requireAuth,
  async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;

      const vendor = await ensureVendorRow(userId);

      const hasListing =
        (await prisma.listing.count({
          where: { vendorId: vendor.id, deletedAt: null, status: { not: 'draft' } },
        })) > 0;
      const progress = await calculateOnboardingProgress(vendor, hasListing);
      await prisma.vendor.update({
        where: { id: vendor.id },
        data: { onboardingProgress: progress },
      });

      res.status(200).json({ vendor });
    } catch (error) {
      next(error);
    }
  },
);

vendorRouter.patch(
  '/me',
  requireAuth,
  async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      const input = UpdateVendorSchema.parse(req.body);

      let vendor = await prisma.vendor.findUnique({ where: { userId: req.userId! } });

      if (!vendor) {
        if (!input.businessName) {
          res.status(400).json({ error: 'BusinessNameRequired' });
          return;
        }

        const slug = await generateUniqueVendorSlug(input.businessName);
        vendor = await prisma.vendor.create({
          data: {
            userId: req.userId!,
            businessName: input.businessName,
            businessSlug: slug,
            ownerName: input.ownerName ?? '',
            description: input.description ?? '',
            whatsappNumber: input.whatsappNumber ?? '',
            publicPhone: input.publicPhone ?? null,
            institutionId: input.institutionId ?? null,
            campusId: input.campusId ?? null,
            profilePhotoPublicId: input.profilePhotoPublicId ?? null,
            status: 'incomplete',
          },
        });

        await prisma.user.update({
          where: { id: req.userId! },
          data: { role: 'vendor' },
        });
      } else {
        const { operatingHours, isAlwaysOpen, timezone, instagramHandle, tiktokHandle, twitterHandle, facebookPage, linkedinProfile, websiteUrl, ...rest } = input as any;
        vendor = await prisma.vendor.update({
          where: { id: vendor.id },
          data: {
            ...rest,
            operatingHours,
            isAlwaysOpen,
            timezone,
            instagramHandle,
            tiktokHandle,
            twitterHandle,
            facebookPage,
            linkedinProfile,
            websiteUrl,
          },
        });
      }

      const hasListing = await prisma.listing.count({
        where: { vendorId: vendor.id, deletedAt: null, status: { not: 'draft' } },
      }) > 0;
      const progress = await calculateOnboardingProgress(vendor, hasListing);
      await prisma.vendor.update({
        where: { id: vendor.id },
        data: { onboardingProgress: progress, lastDraftSavedAt: new Date() },
      });

      res.status(200).json({ vendor });
    } catch (error) {
      next(error);
    }
  },
);

vendorRouter.post(
  '/me/accept-agreement',
  requireAuth,
  rateLimit({ windowMs: 60 * 60 * 1000, max: 10, keyPrefix: 'vendor-agreement' }),
  async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      const input = AcceptVendorAgreementSchema.parse(req.body);

      const vendor = await prisma.vendor.findUnique({ where: { userId: req.userId! } });
      if (!vendor) {
        res.status(404).json({ error: 'NotFound' });
        return;
      }

      const updated = await prisma.vendor.update({
        where: { id: vendor.id },
        data: {
          agreementVersion: input.version,
          agreementAcceptedAt: new Date(),
          agreementIp: getClientIp(req),
          agreementUserAgent: req.headers['user-agent'],
        },
      });

      res.status(200).json({ vendor: updated });
    } catch (error) {
      next(error);
    }
  },
);

vendorRouter.post(
  '/me/go-live',
  requireAuth,
  rateLimit({ windowMs: 60 * 60 * 1000, max: 5, keyPrefix: 'go-live' }),
  async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      const vendor = await prisma.vendor.findUnique({ where: { userId: req.userId! } });
      if (!vendor) {
        res.status(404).json({ error: 'NotFound' });
        return;
      }

      const check = await canGoLive(vendor.id);
      if (!check.canGoLive) {
        res.status(400).json({ error: 'CannotGoLive', reason: check.reason });
        return;
      }

      const updated = await prisma.vendor.update({
        where: { id: vendor.id },
        data: { status: 'live' },
      });

      await prisma.auditLog.create({
        data: {
          actorUserId: req.userId!,
          action: 'vendor_went_live',
          targetType: 'vendor',
          targetId: vendor.id,
          ipAddress: getClientIp(req),
        },
      });

      res.status(200).json({ vendor: updated });
    } catch (error) {
      next(error);
    }
  },
);

vendorRouter.get('/me/listings', requireAuth, async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const vendor = await prisma.vendor.findUnique({ where: { userId: req.userId! } });
    if (!vendor) {
      res.status(404).json({ error: 'NotFound' });
      return;
    }

    const listings = await prisma.listing.findMany({
      where: { vendorId: vendor.id, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: {
        photos: { orderBy: { displayOrder: 'asc' } },
        category: { select: { name: true, slug: true } },
      },
    });

    res.status(200).json({ listings });
  } catch (error) {
    next(error);
  }
});

vendorRouter.get('/me/analytics', requireAuth, async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const vendor = await prisma.vendor.findUnique({ where: { userId: req.userId! } });
    if (!vendor) {
      res.status(404).json({ error: 'NotFound' });
      return;
    }

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalViews,
      viewsLast7Days,
      viewsLast30Days,
      totalClicks,
      clicksLast7Days,
      activeListings,
      totalReviews,
      avgRating,
    ] = await Promise.all([
      prisma.eventLog.count({ where: { vendorId: vendor.id, eventType: { in: ['vendor_view', 'listing_view'] } } }),
      prisma.eventLog.count({ where: { vendorId: vendor.id, eventType: { in: ['vendor_view', 'listing_view'] }, createdAt: { gte: sevenDaysAgo } } }),
      prisma.eventLog.count({ where: { vendorId: vendor.id, eventType: { in: ['vendor_view', 'listing_view'] }, createdAt: { gte: thirtyDaysAgo } } }),
      prisma.vendor.findUnique({ where: { id: vendor.id }, select: { whatsappClickCount: true } }).then((v) => v?.whatsappClickCount ?? 0),
      prisma.eventLog.count({ where: { vendorId: vendor.id, eventType: 'whatsapp_click', createdAt: { gte: sevenDaysAgo } } }),
      prisma.listing.count({ where: { vendorId: vendor.id, status: 'active', deletedAt: null } }),
      prisma.review.count({ where: { vendorId: vendor.id, status: 'visible' } }),
      prisma.review.aggregate({ where: { vendorId: vendor.id, status: 'visible' }, _avg: { rating: true } }).then((r) => r._avg.rating ?? 0),
    ]);

    const topListings = await prisma.listing.findMany({
      where: { vendorId: vendor.id, deletedAt: null },
      orderBy: { viewCount: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        viewCount: true,
        whatsappClickCount: true,
        photos: { orderBy: { displayOrder: 'asc' }, take: 1, select: { url: true } },
      },
    });

    res.status(200).json({
      stats: {
        totalViews,
        viewsLast7Days,
        viewsLast30Days,
        totalClicks,
        clicksLast7Days,
        conversionRate: totalViews > 0 ? Number(((totalClicks / totalViews) * 100).toFixed(1)) : 0,
        activeListings,
        totalReviews,
        avgRating: Number(avgRating.toFixed(1)),
        trustScore: vendor.trustScore,
      },
      topListings,
    });
  } catch (error) {
    next(error);
  }
});

vendorRouter.post(
  '/me/listings',
  requireAuth,
  rateLimit({ windowMs: 60 * 60 * 1000, max: 20, keyPrefix: 'listing-create' }),
  async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      const vendor = await prisma.vendor.findUnique({ where: { userId: req.userId! } });
      if (!vendor) {
        res.status(404).json({ error: 'NotFound' });
        return;
      }

      const input = CreateListingSchema.parse(req.body);
      const listing = await createListing(vendor.id, {
        categoryIds: input.categoryIds,
        title: input.title,
        description: input.description,
        priceMin: input.priceMin,
        priceMax: input.priceMax ?? null,
        section: input.section ?? null,
        photos: input.photos.map((p) => ({
          publicId: p.publicId,
          url: p.url,
          width: p.width,
          height: p.height,
          altText: p.altText ?? null,
          displayOrder: p.displayOrder,
        })),
      });

      const progress = await calculateOnboardingProgress(vendor, true);
      await prisma.vendor.update({
        where: { id: vendor.id },
        data: { onboardingProgress: progress, lastDraftSavedAt: null },
      });

      res.status(201).json({ listing });
    } catch (error) {
      next(error);
    }
  },
);

vendorRouter.patch(
  '/me/listings/:id',
  requireAuth,
  async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      const vendor = await prisma.vendor.findUnique({ where: { userId: req.userId! } });
      if (!vendor) {
        res.status(404).json({ error: 'NotFound' });
        return;
      }

      const input = UpdateListingSchema.parse(req.body);
      const listingInput: Parameters<typeof updateListing>[2] = {
        title: input.title,
        description: input.description,
        priceMin: input.priceMin,
        priceMax: input.priceMax,
        section: input.section,
        ...(input.photos && {
          photos: input.photos.map((p) => ({
            publicId: p.publicId,
            url: p.url,
            width: p.width,
            height: p.height,
            altText: p.altText ?? null,
            displayOrder: p.displayOrder,
          })),
        }),
      };
      const listing = await updateListing(vendor.id, req.params.id ?? '', listingInput);

      res.status(200).json({ listing });
    } catch (error) {
      next(error);
    }
  },
);

vendorRouter.delete(
  '/me/listings/:id',
  requireAuth,
  async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      const vendor = await prisma.vendor.findUnique({ where: { userId: req.userId! } });
      if (!vendor) {
        res.status(404).json({ error: 'NotFound' });
        return;
      }

      await deleteListing(vendor.id, req.params.id ?? '');
      res.status(200).json({ deleted: true });
    } catch (error) {
      next(error);
    }
  },
);

vendorRouter.get(
  '/me/listings/:id',
  requireAuth,
  async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      const vendor = await prisma.vendor.findUnique({ where: { userId: req.userId! } });
      if (!vendor) {
        res.status(404).json({ error: 'NotFound' });
        return;
      }

      const listing = await getVendorOwnListing(vendor.id, req.params.id ?? '');
      if (!listing) {
        res.status(404).json({ error: 'NotFound' });
        return;
      }

      res.status(200).json({ listing });
    } catch (error) {
      next(error);
    }
  },
);

vendorRouter.put(
  '/me/draft',
  requireAuth,
  async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      const { step, data } = req.body as { step: string; data: unknown };

      const user = await prisma.user.findUnique({ where: { id: req.userId! } });
      if (!user) {
        res.status(404).json({ error: 'NotFound' });
        return;
      }

      const existingDrafts = ((user.drafts ?? {}) as unknown) as Record<string, unknown>;
      const updatedDrafts = { ...existingDrafts, [step]: data };

      await prisma.user.update({
        where: { id: req.userId! },
        data: { drafts: updatedDrafts as any },
      });

      res.status(200).json({ saved: true });
    } catch (error) {
      next(error);
    }
  },
);

vendorRouter.get(
  '/me/draft',
  requireAuth,
  async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId! },
        select: { drafts: true },
      });
      if (!user) {
        res.status(404).json({ error: 'NotFound' });
        return;
      }
      res.status(200).json({ drafts: user.drafts ?? {} });
    } catch (error) {
      next(error);
    }
  },
);
