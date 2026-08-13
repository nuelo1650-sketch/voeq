import { prisma } from '../lib/db';
import type { Prisma } from '@prisma/client';
import { generateUniqueListingSlug } from './vendor.service';

export interface ListListingsParams {
  campusId?: string;
  categorySlug?: string;
  page?: number;
  limit?: number;
  sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'rating' | 'popular';
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  verifiedOnly?: boolean;
  featured?: boolean;
  lat?: number;
  lng?: number;
  radiusKm?: number;
}

export interface ListListingsResult {
  listings: Array<{
    id: string;
    slug: string;
    title: string;
    description: string;
    priceMin: number;
    priceMax: number | null;
    photoUrl: string | null;
    categoryName: string;
    categorySlug: string;
    vendorName: string;
    vendorSlug: string;
    campusName: string;
    isFlashDeal: boolean;
    createdAt: Date;
  }>;
  total: number;
  page: number;
  totalPages: number;
  facets: {
    categories: Array<{ name: string; count: number }>;
    priceRange: { min: number; max: number };
  };
}

export async function listListings(params: ListListingsParams): Promise<ListListingsResult> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const offset = (page - 1) * limit;
  const sort = params.sort ?? 'newest';

  const vendorFilter: any = { status: 'live', deletedAt: null };
  if (params.campusId) {
    vendorFilter.campusId = params.campusId;
  }
  if (params.verifiedOnly) {
    vendorFilter.verifiedBadge = true;
  }
  if (params.minRating) {
    vendorFilter.ratingAvg = { gte: params.minRating };
  }

  const where: any = {
    status: 'active',
    deletedAt: null,
    vendor: vendorFilter,
  };

  if (params.categorySlug) {
    where.category = { slug: params.categorySlug };
  }

  if (params.featured) {
    where.isFeatured = true;
  }

  if (params.search) {
    const term = params.search.trim();
    where.OR = [
      { title: { contains: term, mode: 'insensitive' } },
      { description: { contains: term, mode: 'insensitive' } },
      { vendor: { businessName: { contains: term, mode: 'insensitive' } } },
    ];
  }

  if (params.minPrice !== undefined || params.maxPrice !== undefined) {
    where.priceMin = {};
    if (params.minPrice !== undefined) where.priceMin.gte = params.minPrice;
    if (params.maxPrice !== undefined) where.priceMin.lte = params.maxPrice;
  }

  const orderBy: any =
    sort === 'oldest' ? { createdAt: 'asc' } :
    sort === 'price_asc' ? { priceMin: 'asc' } :
    sort === 'price_desc' ? { priceMin: 'desc' } :
    sort === 'rating' ? { vendor: { ratingAvg: 'desc' } } :
    sort === 'popular' ? { viewCount: 'desc' } :
    { createdAt: 'desc' };

  const [listings, total, priceStats, categoryFacets] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy,
      take: limit,
      skip: offset,
      include: {
        category: { select: { name: true, slug: true } },
        vendor: {
          select: {
            businessName: true,
            businessSlug: true,
            ratingAvg: true,
            verifiedBadge: true,
            campus: { select: { name: true } },
          },
        },
        photos: { orderBy: { displayOrder: 'asc' }, take: 1, select: { url: true } },
      },
    }),
    prisma.listing.count({ where }),
    prisma.listing.aggregate({
      where,
      _min: { priceMin: true },
      _max: { priceMax: true },
    }),
    prisma.listing.groupBy({
      by: ['categoryId'],
      where: { ...where, categoryId: { not: undefined } },
      _count: true,
    }),
  ]);

  const categoryIds = categoryFacets.map((f) => f.categoryId).filter((id): id is string => id !== null);
  const categories = await prisma.category.findMany({
    where: { id: { in: categoryIds } },
    select: { id: true, name: true },
  });
  const categoryFacetMap = new Map(categories.map((c) => [c.id, c.name]));

  return {
    listings: listings.map((l) => ({
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
      campusName: l.vendor.campus.name,
      isFlashDeal: l.isFlashDeal,
      createdAt: l.createdAt,
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
    facets: {
      categories: categoryFacets
      .map((f) => ({ name: categoryFacetMap.get(f.categoryId ?? '') ?? 'Unknown', count: f._count }))
        .filter((c) => c.name !== 'Unknown')
        .sort((a, b) => b.count - a.count),
      priceRange: {
        min: priceStats._min.priceMin ? Number(priceStats._min.priceMin) : 0,
        max: priceStats._max.priceMax ? Number(priceStats._max.priceMax) : 100000,
      },
    },
  };
}

export async function getListingBySlug(slug: string): Promise<{
  id: string;
  slug: string;
  title: string;
  description: string;
  priceMin: number;
  priceMax: number | null;
  isFlashDeal: boolean;
  flashDealUntil: Date | null;
  category: { name: string; slug: string };
  vendor: {
    id: string;
    slug: string;
    businessName: string;
    description: string;
    profilePhotoUrl: string | null;
    whatsappNumber: string;
    campus: { name: string };
    ratingAvg: number;
    ratingCount: number;
  };
  photos: Array<{ id: string; url: string; width: number; height: number; altText: string | null }>;
  related: Array<{ id: string; slug: string; title: string; priceMin: number; photoUrl: string | null }>;
} | null> {
  const listing = await prisma.listing.findFirst({
    where: {
      slug,
      status: 'active',
      deletedAt: null,
      vendor: { status: 'live', deletedAt: null },
    },
    include: {
      category: { select: { name: true, slug: true } },
      vendor: {
        select: {
          id: true,
          businessSlug: true,
          businessName: true,
          description: true,
          profilePhotoPublicId: true,
          whatsappNumber: true,
          campus: { select: { name: true } },
          ratingAvg: true,
          ratingCount: true,
        },
      },
      photos: { orderBy: { displayOrder: 'asc' }, select: { id: true, url: true, width: true, height: true, altText: true } },
    },
  });

  if (!listing) return null;

  await prisma.listing.update({
    where: { id: listing.id },
    data: { viewCount: { increment: 1 } },
  });

  const related = await prisma.listing.findMany({
    where: {
      categoryId: listing.categoryId ?? undefined,
      id: { not: listing.id },
      status: 'active',
      deletedAt: null,
      vendor: { status: 'live', deletedAt: null },
    },
    orderBy: { createdAt: 'desc' },
    take: 6,
    include: {
      photos: { orderBy: { displayOrder: 'asc' }, take: 1, select: { url: true } },
    },
  });

  return {
    id: listing.id,
    slug: listing.slug,
    title: listing.title,
    description: listing.description,
    priceMin: Number(listing.priceMin),
    priceMax: listing.priceMax ? Number(listing.priceMax) : null,
    isFlashDeal: listing.isFlashDeal,
    flashDealUntil: listing.flashDealUntil,
    category: listing.category ?? { name: '', slug: '' },
    vendor: {
      id: listing.vendor.id,
      slug: listing.vendor.businessSlug,
      businessName: listing.vendor.businessName,
      description: listing.vendor.description,
      profilePhotoUrl: listing.vendor.profilePhotoPublicId,
      whatsappNumber: listing.vendor.whatsappNumber,
      campus: listing.vendor.campus,
      ratingAvg: listing.vendor.ratingAvg,
      ratingCount: listing.vendor.ratingCount,
    },
    photos: listing.photos,
    related: related.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      priceMin: Number(r.priceMin),
      photoUrl: r.photos[0]?.url ?? null,
    })),
  };
}

export async function createListing(
  vendorId: string,
  input: {
    categoryIds: string[];
    title: string;
    description: string;
    priceMin: number;
    priceMax: number | null;
    section: string | null;
    photos: Array<{
      publicId: string;
      url: string;
      width: number;
      height: number;
      altText: string | null;
      displayOrder: number;
    }>;
  },
) {
  const slug = await generateUniqueListingSlug(vendorId, input.title);

  return prisma.listing.create({
    data: {
      vendorId,
      categoryId: input.categoryIds[0],
      slug,
      title: input.title,
      description: input.description,
      priceMin: input.priceMin,
      priceMax: input.priceMax,
      section: input.section,
      status: 'active',
      photos: {
        create: input.photos.map((p) => ({
          publicId: p.publicId,
          url: p.url,
          width: p.width,
          height: p.height,
          altText: p.altText,
          displayOrder: p.displayOrder,
        })),
      },
      categories: {
        create: input.categoryIds.map((categoryId, index) => ({
          categoryId,
          isPrimary: index === 0,
        })),
      },
    },
    include: {
      category: { select: { name: true, slug: true } },
      vendor: { select: { id: true, businessName: true, businessSlug: true, description: true, profilePhotoPublicId: true, whatsappNumber: true, ratingAvg: true, ratingCount: true, campus: { select: { name: true } } } },
      photos: { orderBy: { displayOrder: 'asc' }, select: { id: true, url: true, width: true, height: true, altText: true, displayOrder: true } },
    },
  });
}

export async function updateListing(
  vendorId: string,
  listingId: string,
  input: {
    title?: string;
    description?: string;
    priceMin?: number;
    priceMax?: number | null;
    section?: string | null;
    photos?: Array<{
      publicId: string;
      url: string;
      width: number;
      height: number;
      altText: string | null;
      displayOrder: number;
    }>;
  },
) {
  const listing = await prisma.listing.findFirst({
    where: { id: listingId, vendorId, deletedAt: null },
    include: { photos: true },
  });

  if (!listing) return null;

  const data: Record<string, unknown> = {};
  if (input.title !== undefined) data.title = input.title;
  if (input.description !== undefined) data.description = input.description;
  if (input.priceMin !== undefined) data.priceMin = input.priceMin;
  if (input.priceMax !== undefined) data.priceMax = input.priceMax;
  if (input.section !== undefined) data.section = input.section;

  if (input.photos && input.photos.length > 0) {
    data.photos = {
      deleteMany: {},
      create: input.photos.map((p) => ({
        publicId: p.publicId,
        url: p.url,
        width: p.width,
        height: p.height,
        altText: p.altText,
        displayOrder: p.displayOrder,
      })),
    };
  }

  return prisma.listing.update({
    where: { id: listing.id },
    data,
    include: {
      category: { select: { name: true, slug: true } },
      vendor: { select: { id: true, businessName: true, businessSlug: true, description: true, profilePhotoPublicId: true, whatsappNumber: true, ratingAvg: true, ratingCount: true, campus: { select: { name: true } } } },
      photos: { orderBy: { displayOrder: 'asc' }, select: { url: true } },
    },
  });
}

export async function deleteListing(vendorId: string, listingId: string) {
  const listing = await prisma.listing.findFirst({
    where: { id: listingId, vendorId, deletedAt: null },
  });

  if (!listing) return null;

  await prisma.listing.update({
    where: { id: listing.id },
    data: { deletedAt: new Date() },
  });

  return { deleted: true };
}

export async function getVendorOwnListing(vendorId: string, listingId: string) {
  const listing = await prisma.listing.findFirst({
    where: { id: listingId, vendorId, deletedAt: null },
    include: {
      category: { select: { name: true, slug: true } },
      vendor: { select: { id: true, businessName: true, businessSlug: true, description: true, profilePhotoPublicId: true, whatsappNumber: true, ratingAvg: true, ratingCount: true, campus: { select: { name: true } } } },
      photos: { orderBy: { displayOrder: 'asc' }, select: { id: true, url: true, width: true, height: true, altText: true, displayOrder: true } },
    },
  });

  if (!listing) return null;

  return {
    id: listing.id,
    slug: listing.slug,
    title: listing.title,
    description: listing.description,
    priceMin: Number(listing.priceMin),
    priceMax: listing.priceMax ? Number(listing.priceMax) : null,
    isFlashDeal: listing.isFlashDeal,
    flashDealUntil: listing.flashDealUntil,
    category: listing.category ?? { name: '', slug: '' },
    vendor: {
      id: listing.vendor.id,
      slug: listing.vendor.businessSlug,
      businessName: listing.vendor.businessName,
      description: listing.vendor.description,
      profilePhotoUrl: listing.vendor.profilePhotoPublicId,
      whatsappNumber: listing.vendor.whatsappNumber,
      campus: listing.vendor.campus,
      ratingAvg: listing.vendor.ratingAvg,
      ratingCount: listing.vendor.ratingCount,
    },
    photos: listing.photos,
  };
}
