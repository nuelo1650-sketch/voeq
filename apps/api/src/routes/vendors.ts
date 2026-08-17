import { Router, type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../lib/db';

export const vendorsRouter: ReturnType<typeof Router> = Router();

vendorsRouter.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug;
    if (!slug) {
      res.status(400).json({ error: 'SlugRequired' });
      return;
    }
    const vendor = await prisma.vendor.findFirst({
      where: { businessSlug: slug, status: 'live', deletedAt: null },
      include: {
        institution: { select: { name: true, slug: true } },
        campus: { select: { name: true, slug: true } },
        listings: {
          where: { status: 'active', deletedAt: null },
          orderBy: { createdAt: 'desc' },
          include: {
            category: { select: { name: true, slug: true } },
            photos: { orderBy: { displayOrder: 'asc' }, take: 1, select: { url: true } },
          },
        },
        reviews: {
          where: { status: 'visible' },
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            user: { select: { name: true, image: true } },
          },
        },
      },
    });

    if (!vendor) {
      res.status(404).json({ error: 'NotFound' });
      return;
    }

    const followerCount = await prisma.follow.count({
      where: { vendorId: vendor.id },
    });

    await prisma.vendor.update({
      where: { id: vendor.id },
      data: { viewCount: { increment: 1 } },
    });

    res.status(200).json({
      vendor: {
        id: vendor.id,
        slug: vendor.businessSlug,
        businessName: vendor.businessName,
        description: vendor.description,
        profilePhotoUrl: vendor.profilePhotoPublicId,
        whatsappNumber: vendor.whatsappNumber,
        verifiedBadge: vendor.verifiedBadge,
        trustScore: vendor.trustScore,
        ratingAvg: vendor.ratingAvg,
        ratingCount: vendor.ratingCount,
        followerCount,
        institution: vendor.institution,
        campus: vendor.campus,
        listings: vendor.listings.map((l) => ({
          id: l.id,
          slug: l.slug,
          title: l.title,
          description: l.description,
          priceMin: Number(l.priceMin),
          priceMax: l.priceMax ? Number(l.priceMax) : null,
          photoUrl: l.photos[0]?.url ?? null,
          category: l.category,
        })),
        reviews: vendor.reviews.map((r) => ({
          id: r.id,
          rating: r.rating,
          text: r.text,
          isVerifiedPurchase: r.isVerifiedPurchase,
          vendorResponse: r.vendorResponse,
          vendorRespondedAt: r.vendorRespondedAt,
          createdAt: r.createdAt,
          user: { name: r.user.name, image: r.user.image },
        })),
      },
    });
  } catch (error) {
    next(error);
  }
});
