import { prisma } from '../lib/db';

export interface SearchParams {
  query: string;
  campusId?: string;
  categorySlug?: string;
  page?: number;
  limit?: number;
}

export interface SearchResults {
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
  }>;
  vendors: Array<{
    id: string;
    slug: string;
    businessName: string;
    description: string;
    photoUrl: string | null;
    campusName: string;
    ratingAvg: number;
    ratingCount: number;
  }>;
  totalListings: number;
  totalVendors: number;
  page: number;
  totalPages: number;
}

export async function searchAll(params: SearchParams): Promise<SearchResults> {
  const { query, campusId, categorySlug } = params;
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const offset = (page - 1) * limit;

  const trimmed = query.trim();
  if (!trimmed) {
    return { listings: [], vendors: [], totalListings: 0, totalVendors: 0, page, totalPages: 0 };
  }

  const tsQuery = trimmed
    .split(/\s+/)
    .filter((t) => t.length > 0)
    .map((t) => t.replace(/[^\w]/g, ''))
    .filter((t) => t.length > 0)
    .map((t) => `${t}:*`)
    .join(' & ');

  const listingWhere: any = {
    status: 'active',
    deletedAt: null,
    vendor: {
      status: 'live',
      deletedAt: null,
      ...(campusId ? { campusId: campusId as string } : {}),
    },
  };

  if (categorySlug) {
    listingWhere.category = { slug: categorySlug };
  }

  const [listings, totalListings, vendors, totalVendors] = await Promise.all([
    prisma.$queryRaw<Array<{
      id: string;
      slug: string;
      title: string;
      description: string;
      price_min: string;
      price_max: string | null;
      photo_url: string | null;
      category_name: string;
      category_slug: string;
      vendor_name: string;
      vendor_slug: string;
      campus_name: string;
      rank: number;
    }>>`
      SELECT 
        l.id,
        l.slug,
        l.title,
        l.description,
        l."priceMin" as price_min,
        l."priceMax" as price_max,
        lp.url as photo_url,
        c.name as category_name,
        c.slug as category_slug,
        v."businessName" as vendor_name,
        v."businessSlug" as vendor_slug,
        camp.name as campus_name,
        ts_rank(l."searchVector", to_tsquery('english', ${tsQuery})) as rank
      FROM "Listing" l
      INNER JOIN "Vendor" v ON l."vendorId" = v.id
      INNER JOIN "Category" c ON l."categoryId" = c.id
      INNER JOIN "Campus" camp ON v."campusId" = camp.id
      LEFT JOIN "ListingPhoto" lp ON lp."listingId" = l.id AND lp."displayOrder" = 0
      WHERE l.status = 'active'
        AND l."deletedAt" IS NULL
        AND v.status = 'live'
        AND v."deletedAt" IS NULL
        AND l."searchVector" @@ to_tsquery('english', ${tsQuery})
        ${campusId ? `AND v."campusId" = '${campusId}'` : ''}
        ${categorySlug ? `AND c.slug = '${categorySlug}'` : ''}
      ORDER BY rank DESC, l."createdAt" DESC
      LIMIT ${limit} OFFSET ${offset}
    `,
    prisma.$queryRaw<Array<{ count: string }>>`
      SELECT COUNT(*) as count
      FROM "Listing" l
      INNER JOIN "Vendor" v ON l."vendorId" = v.id
      INNER JOIN "Category" c ON l."categoryId" = c.id
      WHERE l.status = 'active'
        AND l."deletedAt" IS NULL
        AND v.status = 'live'
        AND v."deletedAt" IS NULL
        AND l."searchVector" @@ to_tsquery('english', ${tsQuery})
        ${campusId ? `AND v."campusId" = '${campusId}'` : ''}
        ${categorySlug ? `AND c.slug = '${categorySlug}'` : ''}
    `,
    prisma.$queryRaw<Array<{
      id: string;
      slug: string;
      business_name: string;
      description: string;
      photo_url: string | null;
      campus_name: string;
      rating_avg: number;
      rating_count: number;
      rank: number;
    }>>`
      SELECT 
        v.id,
        v."businessSlug" as slug,
        v."businessName" as business_name,
        v.description,
        v."profilePhotoPublicId" as photo_url,
        camp.name as campus_name,
        v."ratingAvg" as rating_avg,
        v."ratingCount" as rating_count,
        ts_rank(v."searchVector", to_tsquery('english', ${tsQuery})) as rank
      FROM "Vendor" v
      INNER JOIN "Campus" camp ON v."campusId" = camp.id
      WHERE v.status = 'live'
        AND v."deletedAt" IS NULL
        AND v."searchVector" @@ to_tsquery('english', ${tsQuery})
        ${campusId ? `AND v."campusId" = '${campusId}'` : ''}
      ORDER BY rank DESC, v."createdAt" DESC
      LIMIT 5
    `,
    prisma.$queryRaw<Array<{ count: string }>>`
      SELECT COUNT(*) as count
      FROM "Vendor" v
      WHERE v.status = 'live'
        AND v."deletedAt" IS NULL
        AND v."searchVector" @@ to_tsquery('english', ${tsQuery})
        ${campusId ? `AND v."campusId" = '${campusId}'` : ''}
    `,
  ]);

  const totalListingsCount = Number(totalListings[0]?.count ?? 0);
  const totalVendorsCount = Number(totalVendors[0]?.count ?? 0);
  const totalPages = Math.ceil(totalListingsCount / limit);

  return {
    listings: listings.map((l) => ({
      id: l.id,
      slug: l.slug,
      title: l.title,
      description: l.description,
      priceMin: Number(l.price_min),
      priceMax: l.price_max ? Number(l.price_max) : null,
      photoUrl: l.photo_url,
      categoryName: l.category_name,
      categorySlug: l.category_slug,
      vendorName: l.vendor_name,
      vendorSlug: l.vendor_slug,
      campusName: l.campus_name,
    })),
    vendors: vendors.map((v) => ({
      id: v.id,
      slug: v.slug,
      businessName: v.business_name,
      description: v.description,
      photoUrl: v.photo_url,
      campusName: v.campus_name,
      ratingAvg: v.rating_avg,
      ratingCount: v.rating_count,
    })),
    totalListings: totalListingsCount,
    totalVendors: totalVendorsCount,
    page,
    totalPages,
  };
}
