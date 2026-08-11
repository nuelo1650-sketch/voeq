import { serverApi } from './server-api';
import type { VendorProfile, Listing } from './vendor-client';

export async function serverGetMyVendor(): Promise<{ vendor: VendorProfile; progress: number } | { hasVendor: false }> {
  return serverApi('/api/vendors/me');
}

export async function serverGetMyListings(): Promise<{ listings: Listing[] }> {
  return serverApi('/api/vendors/me/listings');
}

export async function serverGetMyAnalytics(): Promise<{
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
  return serverApi('/api/vendors/me/analytics');
}
