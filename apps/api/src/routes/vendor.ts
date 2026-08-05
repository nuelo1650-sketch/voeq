import { Router, type Response, type NextFunction } from 'express';
import {
  UpdateVendorSchema,
  AcceptVendorAgreementSchema,
  CreateListingSchema,
  UpdateListingSchema,
} from '../schemas/vendor';
import { requireAuth, type AuthedRequest } from '../middleware/auth';
import { rateLimit } from '../middleware/rate-limit';
import { prisma } from '@voeq/db';
import {
  generateUniqueVendorSlug,
  calculateOnboardingProgress,
  canGoLive,
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
            institutionId: input.institutionId ?? '',
            campusId: input.campusId ?? '',
            profilePhotoPublicId: input.profilePhotoPublicId ?? null,
            status: 'incomplete',
          },
        });

        await prisma.user.update({
          where: { id: req.userId! },
          data: { role: 'vendor' },
        });
      } else {
        vendor = await prisma.vendor.update({
          where: { id: vendor.id },
          data: input,
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

    const [views, clicks, listingsCount, reviewsCount, recentEvents] = await Promise.all([
      prisma.eventLog.count({
        where: { vendorId: vendor.id, eventType: 'vendor_view' },
      }),
      prisma.vendor.findUnique({ where: { id: vendor.id }, select: { whatsappClickCount: true } }),
      prisma.listing.count({ where: { vendorId: vendor.id, deletedAt: null, status: 'active' } }),
      prisma.review.count({ where: { vendorId: vendor.id, status: 'visible' } }),
      prisma.eventLog.findMany({
        where: { vendorId: vendor.id, eventType: { in: ['vendor_view', 'whatsapp_click', 'listing_view'] } },
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: { eventType: true, createdAt: true, listingId: true },
      }),
    ]);

    res.status(200).json({
      stats: {
        totalViews: views,
        whatsappClicks: clicks?.whatsappClickCount ?? 0,
        activeListings: listingsCount,
        reviews: reviewsCount,
      },
      recentEvents,
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
        categoryId: input.categoryId,
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
        ...input,
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
      const { step, data } = req.body as { step: string; data: Prisma.InputJsonValue };

      const user = await prisma.user.findUnique({ where: { id: req.userId! } });
      if (!user) {
        res.status(404).json({ error: 'NotFound' });
        return;
      }

      const existingDrafts = ((user.drafts ?? {}) as Prisma.InputJsonValue) as Record<string, Prisma.InputJsonValue>;
      const updatedDrafts = { ...existingDrafts, [step]: data };

      await prisma.user.update({
        where: { id: req.userId! },
        data: { drafts: updatedDrafts as Prisma.InputJsonValue },
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
