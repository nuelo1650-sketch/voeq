import { serverApi } from './server-api';
import type { ListListingsParams, ListListingsResult, SearchResult, CategorySummary, WishlistItemSummary, FollowSummary } from './marketplace-client';

export async function serverListListings(params: ListListingsParams = {}): Promise<ListListingsResult> {
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
  return serverApi<ListListingsResult>(`/api/listings${query ? `?${query}` : ''}`);
}

export async function serverSearch(params: { q: string; campusId?: string; category?: string; page?: number }): Promise<SearchResult> {
  const searchParams = new URLSearchParams({ q: params.q });
  if (params.campusId) searchParams.set('campusId', params.campusId);
  if (params.category) searchParams.set('category', params.category);
  if (params.page) searchParams.set('page', String(params.page));
  return serverApi<SearchResult>(`/api/search?${searchParams.toString()}`);
}

export async function serverGetCategories(): Promise<{ categories: CategorySummary[] }> {
  return serverApi<{ categories: CategorySummary[] }>('/api/categories');
}

export interface PressItemSummary {
  id: string;
  kind: string;
  title: string;
  summary: string | null;
  body: string | null;
  publishDate: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function serverGetPressItems(): Promise<{ items: PressItemSummary[] }> {
  return serverApi<{ items: PressItemSummary[] }>('/api/press');
}

export async function serverGetWishlist(): Promise<{ items: WishlistItemSummary[] }> {
  return serverApi<{ items: WishlistItemSummary[] }>('/api/wishlist');
}

export async function serverGetFollowing(): Promise<{ follows: FollowSummary[] }> {
  return serverApi<{ follows: FollowSummary[] }>('/api/follow/following');
}

export async function serverGetMyDisputes(): Promise<{ disputes: any[] }> {
  return serverApi('/api/disputes/mine');
}
