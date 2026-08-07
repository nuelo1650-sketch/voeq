import { prisma } from '../lib/db';
import type { Vendor } from '@prisma/client';

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

export async function generateUniqueVendorSlug(name: string): Promise<string> {
  const base = generateSlug(name);
  let slug = base;
  let counter = 1;

  while (await prisma.vendor.findUnique({ where: { businessSlug: slug } })) {
    counter++;
    slug = `${base}-${counter}`;
  }

  return slug;
}

export async function generateUniqueListingSlug(vendorId: string, title: string): Promise<string> {
  const base = generateSlug(title);
  let slug = base;
  let counter = 1;

  while (await prisma.listing.findUnique({ where: { vendorId_slug: { vendorId, slug } } })) {
    counter++;
    slug = `${base}-${counter}`;
  }

  return slug;
}

export async function calculateOnboardingProgress(vendor: Vendor | null, hasListing: boolean): Promise<number> {
  if (!vendor) return 0;

  let progress = 0;

  if (vendor.businessName && vendor.ownerName && vendor.description.length >= 100) {
    progress += 20;
  }

  if (vendor.whatsappNumber && vendor.institutionId && vendor.campusId) {
    progress += 20;
  }

  if (vendor.profilePhotoPublicId) {
    progress += 20;
  }

  if (hasListing) {
    progress += 20;
  }

  if (vendor.agreementVersion && vendor.agreementAcceptedAt && vendor.status === 'live') {
    progress += 20;
  }

  return progress;
}

export async function canGoLive(vendorId: string): Promise<{ canGoLive: boolean; reason?: string }> {
  const vendor = await prisma.vendor.findUnique({
    where: { id: vendorId },
    include: { listings: { where: { status: 'active', deletedAt: null } } },
  });

  if (!vendor) return { canGoLive: false, reason: 'Vendor not found' };
  if (vendor.status === 'live') return { canGoLive: true };
  if (!vendor.businessName) return { canGoLive: false, reason: 'Business name missing' };
  if (!vendor.whatsappNumber) return { canGoLive: false, reason: 'WhatsApp number missing' };
  if (!vendor.profilePhotoPublicId) return { canGoLive: false, reason: 'Profile photo missing' };
  if (vendor.listings.length === 0) return { canGoLive: false, reason: 'At least one listing required' };
  if (!vendor.agreementAcceptedAt) return { canGoLive: false, reason: 'Vendor agreement must be accepted' };

  return { canGoLive: true };
}
