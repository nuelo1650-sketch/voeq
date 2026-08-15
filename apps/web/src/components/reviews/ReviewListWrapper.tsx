'use client';

import { useState, useEffect } from 'react';
import { ReviewList } from './ReviewList';
import { listVendorReviews, type Review } from '@/lib/review-client';

interface Props {
  vendorId: string;
  vendorName: string;
  vendorSlug: string;
}

export function ReviewListWrapper({ vendorId, vendorName, vendorSlug }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [myUserId, setMyUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      listVendorReviews(vendorId, 1).catch(() => ({ reviews: [], total: 0 })),
      fetch('/api/users/me', { credentials: 'include' })
        .then(res => res.ok ? res.json() : null)
        .catch(() => null),
    ]).then(([data, me]) => {
      setReviews(data.reviews);
      setTotal(data.total);
      setMyUserId(me?.user?.id ?? null);
      setLoading(false);
    });
  }, [vendorId]);

  if (loading) {
    return <div className="py-8 text-center text-sm text-forest-700/60 dark:text-cream-100/60">Loading reviews…</div>;
  }

  return (
    <ReviewList
      vendorId={vendorId}
      vendorName={vendorName}
      vendorSlug={vendorSlug}
      initialReviews={reviews}
      initialTotal={total}
      myUserId={myUserId}
    />
  );
}
