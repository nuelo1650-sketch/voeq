import { prisma } from '@voeq/db';

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = typeof value === 'object' ? JSON.stringify(value) : String(value);
  return `"${str.replace(/"/g, '""')}"`;
}

export function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0] as Record<string, unknown>);
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => escapeCsv(row[h])).join(','));
  }
  return lines.join('\n');
}

export async function exportUsersCsv() {
  const users = await prisma.user.findMany({
    where: { deletedAt: null },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      createdAt: true,
      lastSignInAt: true,
    },
  });
  return toCsv(users);
}

export async function exportVendorsCsv() {
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
  return toCsv(vendors.map((v) => ({ ...v, campusName: (v.campus as { name?: string } | null)?.name ?? '' })));
}

export async function exportListingsCsv() {
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
  return toCsv(
    listings.map((l) => ({
      ...l,
      categoryName: (l.category as { name?: string } | null)?.name ?? '',
      vendorName: (l.vendor as { businessName?: string } | null)?.businessName ?? '',
    })),
  );
}

export async function exportReviewsCsv() {
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
  return toCsv(
    reviews.map((r) => ({
      ...r,
      vendorName: (r.vendor as { businessName?: string } | null)?.businessName ?? '',
      userEmail: (r.user as { email?: string } | null)?.email ?? '',
      userName: (r.user as { name?: string } | null)?.name ?? '',
    })),
  );
}
