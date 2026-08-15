'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ReviewItem } from './ReviewItem';
import { ReviewForm } from './ReviewForm';
import { listVendorReviews, type Review } from '@/lib/review-client';

interface ReviewListProps {
  vendorId: string;
  vendorName: string;
  vendorSlug: string;
  initialReviews: Review[];
  initialTotal: number;
  myUserId: string | null;
}

export function ReviewList({ vendorId, vendorName, initialReviews, initialTotal, myUserId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const totalPages = Math.ceil(total / 10);

  const loadMore = async () => {
    setLoading(true);
    try {
      const next = page + 1;
      const result = await listVendorReviews(vendorId, next);
      setReviews((prev) => [...prev, ...result.reviews]);
      setPage(next);
      setTotal(result.total);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">
          Reviews ({total})
        </h2>
        {myUserId && (
          <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
            Write a review
          </Button>
        )}
      </div>

      {reviews.length > 0 ? (
        <>
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </div>

          {page < totalPages && (
            <div className="flex justify-center pt-4">
              <Button variant="outline" onClick={loadMore} isLoading={loading}>
                Load more reviews
              </Button>
            </div>
          )}
        </>
      ) : (
        <p className="rounded-2xl border border-cream-300 bg-cream-50 p-8 text-center text-sm text-forest-700/60 dark:border-forest-700 dark:bg-forest-800 dark:text-cream-100/60 dark:border-cream-100">
          No reviews yet. Be the first to share your experience.
        </p>
      )}

      {showForm && (
        <ReviewForm
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          vendorId={vendorId}
          vendorName={vendorName}
          onSuccess={() => {
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}
