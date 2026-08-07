import { prisma } from '../lib/db';

const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000;

interface ReviewWithRelations {
  id: string;
  vendorId: string;
  userId: string;
  listingId: string | null;
  rating: number;
  text: string;
  isVerifiedPurchase: boolean;
  status: string;
  vendorResponse: string | null;
  vendorRespondedAt: Date | null;
  createdAt: Date;
  user: { name: string | null; image: string | null };
  listing?: { title: string; slug: string } | null;
}

interface ReviewListResult {
  reviews: ReviewWithRelations[];
  total: number;
  page: number;
  totalPages: number;
}

export async function createReview(
  vendorId: string,
  userId: string,
  input: { rating: number; text: string; listingId?: string },
): Promise<{ review: ReviewWithRelations }> {
  const existing = await prisma.review.findUnique({
    where: { userId_vendorId: { userId, vendorId } },
  });
  if (existing) {
    throw new Error('You already have a review for this vendor. Edit it instead.');
  }

  const hasClicked = await prisma.eventLog.findFirst({
    where: {
      userId,
      vendorId,
      eventType: 'whatsapp_click',
      createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    },
  });

  const review = await prisma.review.create({
    data: {
      vendorId,
      userId,
      listingId: input.listingId,
      rating: input.rating,
      text: input.text,
      isVerifiedPurchase: !!hasClicked,
      status: 'visible',
    },
    include: {
      user: { select: { name: true, image: true } },
    },
  });

  await updateVendorRating(vendorId);

  return { review: review as unknown as ReviewWithRelations };
}

export async function updateReview(
  reviewId: string,
  userId: string,
  input: { rating?: number; text?: string },
): Promise<{ review: ReviewWithRelations }> {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new Error('Review not found');
  if (review.userId !== userId) throw new Error('Unauthorized');
  if (review.status !== 'visible') throw new Error('Review not editable');

  const ageMs = Date.now() - review.createdAt.getTime();
  if (ageMs > EDIT_WINDOW_MS) {
    throw new Error('Edit window has closed (24 hours)');
  }

  const updated = await prisma.review.update({
    where: { id: reviewId },
    data: {
      rating: input.rating ?? review.rating,
      text: input.text ?? review.text,
    },
  });

  await updateVendorRating(review.vendorId);

  return { review: updated as unknown as ReviewWithRelations };
}

export async function addVendorResponse(
  reviewId: string,
  vendorId: string,
  text: string,
): Promise<{ review: ReviewWithRelations }> {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new Error('Review not found');
  if (review.vendorId !== vendorId) throw new Error('Unauthorized');
  if (review.vendorResponse) throw new Error('You already responded to this review');

  const updated = await prisma.review.update({
    where: { id: reviewId },
    data: {
      vendorResponse: text,
      vendorRespondedAt: new Date(),
    },
  });

  return { review: updated as unknown as ReviewWithRelations };
}

export async function updateVendorResponse(
  reviewId: string,
  vendorId: string,
  text: string,
): Promise<{ review: ReviewWithRelations }> {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new Error('Review not found');
  if (review.vendorId !== vendorId) throw new Error('Unauthorized');
  if (!review.vendorRespondedAt) throw new Error('No existing response');

  const ageMs = Date.now() - review.vendorRespondedAt.getTime();
  if (ageMs > EDIT_WINDOW_MS) {
    throw new Error('Edit window has closed (24 hours)');
  }

  const updated = await prisma.review.update({
    where: { id: reviewId },
    data: { vendorResponse: text, vendorRespondedAt: new Date() },
  });

  return { review: updated as unknown as ReviewWithRelations };
}

export async function listVendorReviews(
  vendorId: string,
  page: number = 1,
  limit: number = 10,
): Promise<ReviewListResult> {
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { vendorId, status: 'visible' },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        user: { select: { name: true, image: true } },
        listing: { select: { title: true, slug: true } },
      },
    }),
    prisma.review.count({ where: { vendorId, status: 'visible' } }),
  ]);

  return {
    reviews: reviews as ReviewWithRelations[],
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

async function updateVendorRating(vendorId: string): Promise<void> {
  const reviews = await prisma.review.findMany({
    where: { vendorId, status: 'visible' },
    select: { rating: true },
  });

  const count = reviews.length;
  const avg = count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;

  await prisma.vendor.update({
    where: { id: vendorId },
    data: { ratingAvg: avg, ratingCount: count },
  });
}

export function canEditReview(review: { createdAt: Date }): boolean {
  return Date.now() - review.createdAt.getTime() < EDIT_WINDOW_MS;
}
