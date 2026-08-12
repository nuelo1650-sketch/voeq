import { api } from './api';

export interface SiteStats {
  institutions: number;
  categories: number;
  vendors: number;
  listings: number;
}

export async function getStats(): Promise<SiteStats> {
  try {
    const data = await api<{ stats: SiteStats }>('/api/stats');
    return data.stats;
  } catch {
    return { institutions: 0, categories: 0, vendors: 0, listings: 0 };
  }
}

export interface ListingSummary {
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
  isFlashDeal?: boolean;
}

export interface ListListingsParams {
  campusId?: string;
  category?: string;
  page?: number;
  limit?: number;
  sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'rating' | 'popular';
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  verifiedOnly?: boolean;
  lat?: number;
  lng?: number;
  radiusKm?: number;
}

export interface ListListingsResult {
  listings: ListingSummary[];
  total: number;
  page: number;
  totalPages: number;
  facets?: {
    categories: Array<{ name: string; count: number }>;
    priceRange: { min: number; max: number };
  };
}

export async function listListings(params: ListListingsParams = {}): Promise<ListListingsResult> {
  const searchParams = new URLSearchParams();
  if (params.campusId) searchParams.set('campusId', params.campusId);
  if (params.category) searchParams.set('category', params.category);
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.sort) searchParams.set('sort', params.sort);
  if (params.search) searchParams.set('search', params.search);
  if (params.minPrice !== undefined) searchParams.set('minPrice', String(params.minPrice));
  if (params.maxPrice !== undefined) searchParams.set('maxPrice', String(params.maxPrice));
  if (params.minRating !== undefined) searchParams.set('minRating', String(params.minRating));
  if (params.verifiedOnly) searchParams.set('verifiedOnly', 'true');
  if (params.lat !== undefined) searchParams.set('lat', String(params.lat));
  if (params.lng !== undefined) searchParams.set('lng', String(params.lng));
  if (params.radiusKm !== undefined) searchParams.set('radiusKm', String(params.radiusKm));
  const query = searchParams.toString();
  return api<ListListingsResult>(`/api/listings${query ? `?${query}` : ''}`);
}

export interface SearchResult {
  listings: ListingSummary[];
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

export async function search(params: { q: string; campusId?: string; category?: string; page?: number }): Promise<SearchResult> {
  const searchParams = new URLSearchParams({ q: params.q });
  if (params.campusId) searchParams.set('campusId', params.campusId);
  if (params.category) searchParams.set('category', params.category);
  if (params.page) searchParams.set('page', String(params.page));
  return api<SearchResult>(`/api/search?${searchParams.toString()}`);
}

export interface ListingDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceMin: number;
  priceMax: number | null;
  isFlashDeal: boolean;
  flashDealUntil: string | null;
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
}

export async function getListing(slug: string): Promise<{ listing: ListingDetail }> {
  return api<{ listing: ListingDetail }>(`/api/listings/${encodeURIComponent(slug)}`);
}

export interface VendorDetail {
  id: string;
  slug: string;
  businessName: string;
  description: string;
  profilePhotoUrl: string | null;
  whatsappNumber: string;
  verifiedBadge: boolean;
  trustScore: number;
  ratingAvg: number;
  ratingCount: number;
  institution: { name: string; slug: string };
  campus: { name: string; slug: string };
  listings: ListingSummary[];
  reviews: Array<{
    id: string;
    rating: number;
    text: string;
    isVerifiedPurchase: boolean;
    vendorResponse: string | null;
    vendorRespondedAt: string | null;
    createdAt: string;
    user: { name: string | null; image: string | null };
  }>;
  badges: Array<{ id: string; badgeKey: string; earnedAt: string }>;
}

export async function getVendor(slug: string): Promise<{ vendor: VendorDetail }> {
  return api<{ vendor: VendorDetail }>(`/api/vendors/${encodeURIComponent(slug)}`);
}

export async function trackWhatsAppClick(params: { vendorId: string; listingId?: string }): Promise<{
  url: string;
  message: string;
}> {
  return api<{ url: string; message: string }>('/api/whatsapp/click', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export interface CategorySummary {
  id: string;
  slug: string;
  name: string;
  iconName: string;
  displayOrder: number;
  listingCount: number;
}

export async function getCategories(): Promise<{ categories: CategorySummary[] }> {
  return api<{ categories: CategorySummary[] }>('/api/categories');
}

export interface InstitutionSummary {
  id: string;
  name: string;
  slug: string;
  type: string;
}

export async function getInstitutions(): Promise<{ institutions: InstitutionSummary[] }> {
  try {
    return await api<{ institutions: InstitutionSummary[] }>('/api/institutions');
  } catch {
    return { institutions: [] };
  }
}

export interface WishlistItemSummary {
  id: string;
  vendorId: string;
  vendor: {
    id: string;
    businessName: string;
    businessSlug: string;
    description: string;
    profilePhotoUrl: string | null;
    whatsappNumber: string;
    verifiedBadge: boolean;
    trustScore: number;
    ratingAvg: number;
    ratingCount: number;
    institution: { name: string };
    campus: { name: string };
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
    }>;
  };
  createdAt: string;
}

export async function getWishlist(): Promise<{ items: WishlistItemSummary[] }> {
  return api<{ items: WishlistItemSummary[] }>('/api/wishlist');
}

export async function addToWishlist(vendorId: string): Promise<{ added: boolean }> {
  return api<{ added: boolean }>('/api/wishlist', { method: 'POST', body: JSON.stringify({ vendorId }) });
}

export async function removeFromWishlist(vendorId: string): Promise<{ removed: boolean }> {
  return api<{ removed: boolean }>(`/api/wishlist/${vendorId}`, { method: 'DELETE' });
}

export interface FollowSummary {
  id: string;
  vendorId: string;
  vendor: {
    id: string;
    businessName: string;
    businessSlug: string;
    description: string;
    profilePhotoUrl: string | null;
    whatsappNumber: string;
    verifiedBadge: boolean;
    trustScore: number;
    ratingAvg: number;
    ratingCount: number;
    institution: { name: string };
    campus: { name: string };
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
    }>;
  };
  createdAt: string;
}

export async function followVendor(vendorId: string): Promise<{ following: boolean }> {
  return api<{ following: boolean }>('/api/follow', { method: 'POST', body: JSON.stringify({ vendorId }) });
}

export async function unfollowVendor(vendorId: string): Promise<{ following: boolean }> {
  return api<{ following: boolean }>(`/api/follow/${vendorId}`, { method: 'DELETE' });
}

export async function getFollowing(): Promise<{ follows: FollowSummary[] }> {
  return api<{ follows: FollowSummary[] }>('/api/follow/following');
}

export interface NotificationSummary {
  id: string;
  type: 'review';
  title: string;
  body: string;
  vendorSlug: string;
  createdAt: string;
  read: boolean;
}

export async function getNotifications(): Promise<{ notifications: NotificationSummary[] }> {
  return api<{ notifications: NotificationSummary[] }>('/api/notifications');
}

export async function generateWhatsAppMessage(params: {
  template: string;
  vendorName: string;
  listingTitle?: string;
  price?: string;
  date?: string;
  quantity?: number;
  customMessage?: string;
}): Promise<{ message: string }> {
  return api<{ message: string }>('/api/whatsapp/generate-message', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function fileDispute(data: { vendorId: string; listingId?: string; reason: string; details?: string }): Promise<{ dispute: any }> {
  return api('/api/disputes', { method: 'POST', body: JSON.stringify(data) });
}

export async function getMyDisputes(): Promise<{ disputes: any[] }> {
  return api('/api/disputes/mine');
}

export async function getVendorOpenStatus(slug: string): Promise<{ isOpen: boolean; hours?: any }> {
  return api(`/api/vendors/${slug}/is-open`);
}


