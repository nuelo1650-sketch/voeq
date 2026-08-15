'use client';

import { Avatar } from '@/components/ui/Avatar';
import { RatingStars } from '@/components/marketplace/RatingStars';
import { Badge } from '@/components/ui/Badge';
import type { Review } from '@/lib/review-client';

interface ReviewItemProps {
  review: Review;
  showListing?: boolean;
}

export function ReviewItem({ review, showListing = false }: ReviewItemProps) {
  return (
    <article className="rounded-2xl border border-cream-300 bg-cream-50 p-4 sm:p-6 dark:border-forest-700 dark:bg-forest-800 dark:border-cream-100">
      <div className="flex items-start gap-3">
        <Avatar size="md" alt={review.user.name ?? 'User'} src={review.user.image} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-forest-900 dark:text-cream-100">
              {review.user.name ?? 'Anonymous'}
            </span>
            {review.isVerifiedPurchase && (
              <Badge variant="success" className="text-xs">Verified interaction</Badge>
            )}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <RatingStars rating={review.rating} showCount={false} size="sm" />
            <span className="text-xs text-forest-700/60 dark:text-cream-100/60">
              {new Date(review.createdAt).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm text-forest-700/90 dark:text-cream-100/90 whitespace-pre-wrap">
        {review.text}
      </p>

      {showListing && review.listing && (
        <p className="mt-2 text-xs text-forest-700/60 dark:text-cream-100/60">
          About: <span className="font-medium">{review.listing.title}</span>
        </p>
      )}

      {review.vendorResponse && (
        <div className="mt-4 rounded-lg border-l-4 border-gold-500 bg-cream-100 p-3 dark:bg-forest-900">
          <p className="text-xs font-medium text-forest-700 dark:text-cream-100">
            Vendor response · {new Date(review.vendorRespondedAt!).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
          <p className="mt-1 text-sm text-forest-700/90 dark:text-cream-100/90 whitespace-pre-wrap">
            {review.vendorResponse}
          </p>
        </div>
      )}
    </article>
  );
}
