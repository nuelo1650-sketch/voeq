import { Router, type Response, type NextFunction } from 'express';
import { type AdminRequest } from '../../middleware/admin';
import { prisma } from '@voeq/db';
import { toCsv } from '../../services/admin/export.service';

export const exportRouter: ReturnType<typeof Router> = Router();

exportRouter.get('/users', async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      where: { deletedAt: null },
      select: { id: true, email: true, name: true, role: true, status: true, createdAt: true, lastSignInAt: true },
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="users-${Date.now()}.csv"`);
    res.send(toCsv(users));
  } catch (error) {
    next(error);
  }
});

exportRouter.get('/vendors', async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const vendors = await prisma.vendor.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        businessName: true,
        businessSlug: true,
        ownerName: true,
        status: true,
        verifiedBadge: true,
        ratingAvg: true,
        ratingCount: true,
        createdAt: true,
        campus: { select: { name: true } },
      },
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="vendors-${Date.now()}.csv"`);
    res.send(
      toCsv(
        vendors.map((v) => ({
          ...v,
          campusName: (v.campus as { name?: string } | null)?.name ?? '',
        })),
      ),
    );
  } catch (error) {
    next(error);
  }
});

exportRouter.get('/listings', async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const listings = await prisma.listing.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        priceMin: true,
        priceMax: true,
        viewCount: true,
        whatsappClickCount: true,
        createdAt: true,
        category: { select: { name: true } },
        vendor: { select: { businessName: true, businessSlug: true } },
      },
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="listings-${Date.now()}.csv"`);
    res.send(
      toCsv(
        listings.map((l) => ({
          ...l,
          categoryName: (l.category as { name?: string } | null)?.name ?? '',
          vendorName: (l.vendor as { businessName?: string } | null)?.businessName ?? '',
        })),
      ),
    );
  } catch (error) {
    next(error);
  }
});

exportRouter.get('/reviews', async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const reviews = await prisma.review.findMany({
      select: {
        id: true,
        rating: true,
        text: true,
        status: true,
        isVerifiedPurchase: true,
        createdAt: true,
        vendor: { select: { businessName: true } },
        user: { select: { email: true, name: true } },
      },
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="reviews-${Date.now()}.csv"`);
    res.send(
      toCsv(
        reviews.map((r) => ({
          ...r,
          vendorName: (r.vendor as { businessName?: string } | null)?.businessName ?? '',
          userEmail: (r.user as { email?: string } | null)?.email ?? '',
          userName: (r.user as { name?: string } | null)?.name ?? '',
        })),
      ),
    );
  } catch (error) {
    next(error);
  }
});
