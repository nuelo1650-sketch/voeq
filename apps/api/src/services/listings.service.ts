import { prisma } from '../lib/db';
import type { Prisma } from '@prisma/client';
import { generateUniqueListingSlug } from './vendor.service';

export interface ListListingsParams {
  campusId?: string;
  categorySlug?: string;
  page?: number;
  limit?: number;
  sort?: 'newest' | 'price_asc' | 'price_desc';
  minPrice?: number;
  maxPrice?: number;
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
}

export async function listListings(params: ListListingsParams): Promise<ListListingsResult> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const offset = (page - 1) * limit;
  const sort = params.sort ?? 'newest';

  const vendorFilter: Prisma.VendorWhereInput = { status: 'live', deletedAt: null };
  if (params.campusId) {
    vendorFilter.campusId = params.campusId;
  }

  const where: Prisma.ListingWhereInput = {
    status: 'active',
    deletedAt: null,
    vendor: vendorFilter,
  };

  if (params.categorySlug) {
    where.category = { slug: params.categorySlug };
  }

  if (params.minPrice !== undefined || params.maxPrice !== undefined) {
    where.priceMin = {};
    if (params.minPrice !== undefined) where.priceMin.gte = params.minPrice;
    if (params.maxPrice !== undefined) where.priceMin.lte = params.maxPrice;
  }

  const orderBy: Prisma.ListingOrderByWithRelationInput =
    sort === 'price_asc' ? { priceMin: 'asc' } :
    sort === 'price_desc' ? { priceMin: 'desc' } :
    { createdAt: 'desc' };

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy,
      take: limit,
      skip: offset,
      include: {
        category: { select: { name: true, slug: true } },
        vendor: { select: { businessName: true, businessSlug: true, campus: { select: { name: true } } } },
        photos: { orderBy: { displayOrder: 'asc' }, take: 1, select: { url: true } },
      },
    }),
    prisma.listing.count({ where }),
  ]);

  return {
    listings: listings.map((l) => ({
      id: l.id,
      slug: l.slug,
      title: l.title,
      description: l.description,
      priceMin: Number(l.priceMin),
      priceMax: l.priceMax ? Number(l.priceMax) : null,
      photoUrl: l.photos[0]?.url ?? null,
      categoryName: l.category.name,
      categorySlug: l.category.slug,
      vendorName: l.vendor.businessName,
      vendorSlug: l.vendor.businessSlug,
      campusName: l.vendor.campus.name,
      isFlashDeal: l.isFlashDeal,
      createdAt: l.createdAt,
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
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
  related: Array<{
    id: string;
    slug: string;
    title: string;
    priceMin: number;
    photoUrl: string | null;
  }>;
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
      categoryId: listing.categoryId,
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
    category: listing.category,
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
    categoryId: string;
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
      categoryId: input.categoryId,
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
    },
    include: {
      photos: true,
      category: true,
    },
  });
}

export interface UpdateListingInput {
  categoryId?: string;
  title?: string;
  description?: string;
  priceMin?: number;
  priceMax?: number | null;
  section?: string | null;
  status?: 'active' | 'paused' | 'archived';
  photos?: Array<{
    publicId: string;
    url: string;
    width: number;
    height: number;
    altText?: string | null;
    displayOrder: number;
  }>;
}

export async function updateListing(
  vendorId: string,
  listingId: string,
  input: UpdateListingInput,
) {
  const existing = await prisma.listing.findFirst({
    where: { id: listingId, vendorId, deletedAt: null },
  });
  if (!existing) throw new Error('Listing not found or not owned by vendor');

  const { photos, ...data } = input;

  if (photos) {
    await prisma.listingPhoto.deleteMany({ where: { listingId } });
  }

  return prisma.listing.update({
    where: { id: listingId },
    data: {
      ...data,
      ...(photos && {
        photos: {
          create: photos.map((p) => ({
            publicId: p.publicId,
            url: p.url,
            width: p.width,
            height: p.height,
            altText: p.altText,
            displayOrder: p.displayOrder,
          })),
        },
      }),
    },
    include: {
      photos: true,
      category: true,
    },
  });
}

export async function deleteListing(vendorId: string, listingId: string) {
  const existing = await prisma.listing.findFirst({
    where: { id: listingId, vendorId, deletedAt: null },
  });
  if (!existing) throw new Error('Listing not found or not owned by vendor');

  return prisma.listing.update({
    where: { id: listingId },
    data: { deletedAt: new Date(), status: 'archived' },
  });
}

export async function getVendorOwnListing(vendorId: string, listingId: string) {
  return prisma.listing.findFirst({
    where: { id: listingId, vendorId, deletedAt: null },
    include: { photos: { orderBy: { displayOrder: 'asc' } }, category: true },
  });
}
