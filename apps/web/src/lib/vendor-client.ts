import { api } from './api';

export interface VendorProfile {
  id: string;
  businessName: string;
  businessSlug: string;
  ownerName: string;
  description: string;
  profilePhotoPublicId: string | null;
  whatsappNumber: string;
  publicPhone: string | null;
  institution: { id: string; name: string };
  campus: { id: string; name: string };
  status: 'incomplete' | 'pending_review' | 'live' | 'suspended';
  verifiedBadge: boolean;
  agreementAcceptedAt: string | null;
  onboardingProgress: number;
  operatingHours?: Record<string, { open?: string; close?: string; closed?: boolean }> | null;
  isAlwaysOpen?: boolean;
  timezone?: string | null;
  instagramHandle?: string | null;
  tiktokHandle?: string | null;
  twitterHandle?: string | null;
  facebookPage?: string | null;
  linkedinProfile?: string | null;
  websiteUrl?: string | null;
  listings: Array<{
    id: string;
    slug: string;
    title: string;
    status: string;
    photos: Array<{ url: string }>;
    category: { name: string; slug: string };
  }>;
  _count: { listings: number; reviews: number };
}

export async function getMyVendor(): Promise<{ vendor: VendorProfile; progress: number } | { hasVendor: false }> {
  return api('/api/vendors/me');
}

export async function upsertVendor(input: Partial<VendorProfile> & Partial<{
  institutionId: string;
  campusId: string;
  profilePhotoPublicId: string;
  profilePhotoUrl: string;
}>): Promise<{ vendor: VendorProfile }> {
  return api('/api/vendors/me', { method: 'PATCH', body: JSON.stringify(input) });
}

export async function acceptVendorAgreement(version: string): Promise<{ vendor: VendorProfile }> {
  return api('/api/vendors/me/accept-agreement', {
    method: 'POST',
    body: JSON.stringify({ version }),
  });
}

export async function goLive(): Promise<{ vendor: VendorProfile }> {
  return api('/api/vendors/me/go-live', { method: 'POST' });
}

export async function getMyListings(): Promise<{ listings: Listing[] }> {
  return api('/api/vendors/me/listings');
}

export async function getMyAnalytics(): Promise<{
  stats: {
    totalViews: number;
    viewsLast7Days: number;
    viewsLast30Days: number;
    totalClicks: number;
    clicksLast7Days: number;
    conversionRate: number;
    activeListings: number;
    totalReviews: number;
    avgRating: number;
    trustScore: number;
  };
  topListings: Array<{
    id: string;
    title: string;
    slug: string;
    viewCount: number;
    whatsappClickCount: number;
    photos: Array<{ url: string }>;
  }>;
}> {
  return api('/api/vendors/me/analytics');
}

export interface Listing {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceMin: number;
  priceMax: number | null;
  category: { id: string; name: string; slug: string };
  photos: Array<{ publicId: string; url: string; width: number; height: number; altText: string | null; displayOrder: number }>;
  status: 'active' | 'paused' | 'archived' | 'draft';
  section: string | null;
}

export async function createListing(input: {
  categoryIds: string[];
  title: string;
  description: string;
  priceMin: number;
  priceMax?: number;
  section?: string;
  photos: Array<{ publicId: string; url: string; width: number; height: number; altText?: string; displayOrder: number }>;
}): Promise<{ listing: Listing }> {
  return api('/api/vendors/me/listings', { method: 'POST', body: JSON.stringify(input) });
}

export async function updateListing(id: string, input: Partial<{
  categoryId: string;
  title: string;
  description: string;
  priceMin: number;
  priceMax: number;
  section: string;
  status: 'active' | 'paused' | 'archived';
  photos: Array<{ publicId: string; url: string; width: number; height: number; altText?: string; displayOrder: number }>;
}>): Promise<{ listing: Listing }> {
  return api(`/api/vendors/me/listings/${id}`, { method: 'PATCH', body: JSON.stringify(input) });
}

export async function deleteListing(id: string): Promise<{ deleted: true }> {
  return api(`/api/vendors/me/listings/${id}`, { method: 'DELETE' });
}

export async function getMyListing(id: string): Promise<{ listing: Listing }> {
  return api(`/api/vendors/me/listings/${id}`);
}

export async function saveDraft(step: string, data: Record<string, unknown>): Promise<{ saved: true }> {
  return api('/api/vendors/me/draft', { method: 'PUT', body: JSON.stringify({ step, data }) });
}

export async function getDrafts(): Promise<{ drafts: Record<string, unknown> }> {
  return api('/api/vendors/me/draft');
}

export type CategoryNode = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  iconName: string | null;
  imageUrl: string | null;
  displayOrder: number;
  isOfficial: boolean;
  parentId: string | null;
  listingCount: number;
  children: CategoryNode[];
};

export async function getCategories(): Promise<{ categories: CategoryNode[] }> {
  return api('/api/categories');
}
