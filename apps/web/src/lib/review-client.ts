import { api } from './api';

export interface Review {
  id: string;
  rating: number;
  text: string;
  isVerifiedPurchase: boolean;
  vendorResponse: string | null;
  vendorRespondedAt: string | null;
  createdAt: string;
  user: { name: string | null; image: string | null };
  listing: { title: string; slug: string } | null;
  commentsCount: number;
  likesCount: number;
  myLiked: boolean;
}

export async function listVendorReviews(vendorId: string, page: number = 1): Promise<{
  reviews: Review[];
  total: number;
  page: number;
  totalPages: number;
}> {
  return api(`/api/reviews/vendor/${vendorId}?page=${page}`);
}

export async function createReview(vendorId: string, input: {
  rating: number;
  text: string;
  listingId?: string;
}): Promise<{ review: Review }> {
  return api(`/api/reviews/vendor/${vendorId}`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updateReview(reviewId: string, input: {
  rating?: number;
  text?: string;
}): Promise<{ review: Review }> {
  return api(`/api/reviews/${reviewId}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function respondToReview(reviewId: string, text: string): Promise<{ review: Review }> {
  return api(`/api/reviews/${reviewId}/respond`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

export async function updateResponse(reviewId: string, text: string): Promise<{ review: Review }> {
  return api(`/api/reviews/${reviewId}/respond`, {
    method: 'PATCH',
    body: JSON.stringify({ text }),
  });
}

export async function deleteReview(reviewId: string): Promise<{ deleted: true }> {
  return api(`/api/reviews/${reviewId}`, { method: 'DELETE' });
}

export async function listMyReviews(): Promise<{
  reviews: Array<{
    id: string;
    vendorId: string;
    rating: number;
    text: string;
    status: string;
    vendorResponse: string | null;
    createdAt: string;
    vendor: { businessName: string; businessSlug: string };
    listing: { title: string; slug: string } | null;
  }>;
}> {
  return api(`/api/reviews/me`);
}
