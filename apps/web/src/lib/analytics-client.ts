import { api } from './api';

export interface TrendingItem {
  kind: 'listing' | 'vendor';
  id: string;
  title: string;
  slug: string;
  photoUrl: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  views: number;
}

export interface TrendingResult {
  items: TrendingItem[];
  windowDays: number;
}

export async function trackView(kind: 'listing' | 'vendor', id: string, campusId: string): Promise<void> {
  await api('/api/analytics/view', {
    method: 'POST',
    body: JSON.stringify({ kind, id, campusId }),
  });
}

export async function getTrending(campusId: string, limit = 8): Promise<TrendingResult> {
  return api<TrendingResult>(`/api/discover/trending?campusId=${encodeURIComponent(campusId)}&limit=${limit}`);
}
