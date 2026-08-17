'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { listVendorReviews, respondToReview, type Review } from '@/lib/review-client';
import { ThreadCard } from '@/components/brand/Thread';
import { RatingStars } from '@/components/marketplace/RatingStars';

export function ReviewsPanel({ vendorId, businessSlug }: { vendorId: string; businessSlug: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [replying, setReplying] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  const load = () => {
    listVendorReviews(vendorId, 1)
      .then((r) => setReviews(r.reviews))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorId]);

  const awaiting = reviews.filter((r) => !r.vendorResponse).length;

  const submit = async (reviewId: string) => {
    const text = draft.trim();
    if (!text) return;
    try {
      await respondToReview(reviewId, text);
      setReplying(null);
      setDraft('');
      load();
    } catch {
      /* keep draft */
    }
  };

  return (
    <ThreadCard className="p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Reviews</h2>
        <div className="flex items-center gap-3">
          {awaiting > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
              {awaiting} awaiting reply
            </span>
          )}
          <Link href={`/v/${businessSlug}#reviews`} className="text-xs font-medium text-forest-700 hover:underline dark:text-cream-100">
            See all
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="mt-4 text-sm text-forest-700/60 dark:text-cream-100/60">Loading…</p>
      ) : reviews.length === 0 ? (
        <p className="mt-4 text-sm text-forest-700/70 dark:text-cream-100/70">No reviews yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {reviews.slice(0, 4).map((r) => (
            <li key={r.id} className="rounded-xl border border-cream-200 p-3 dark:border-forest-700 dark:border-cream-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RatingStars rating={r.rating} size="sm" />
                  {r.vendorResponse ? (
                    <span className="text-xs text-green-700 dark:text-green-300">Replied</span>
                  ) : (
                    <span className="text-xs text-amber-700 dark:text-amber-300">Awaiting reply</span>
                  )}
                </div>
                <span className="text-xs text-forest-700/50 dark:text-cream-100/50">{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="mt-1.5 text-sm text-forest-900 dark:text-cream-100">{r.text}</p>

              {r.vendorResponse ? (
                <p className="mt-2 rounded-lg bg-cream-100 px-3 py-2 text-sm text-forest-700 dark:bg-forest-900/50 dark:text-cream-100/80">
                  {r.vendorResponse}
                </p>
              ) : replying === r.id ? (
                <div className="mt-2">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={2}
                    placeholder="Write a reply…"
                    className="w-full resize-none rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-forest-900 outline-none focus:border-forest-700 dark:border-forest-700 dark:bg-forest-800 dark:border-cream-100 dark:text-cream-100"
                  />
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => submit(r.id)} className="rounded-lg bg-gold-500 px-3 py-1.5 text-sm font-semibold text-forest-900">
                      Send reply
                    </button>
                    <button onClick={() => { setReplying(null); setDraft(''); }} className="rounded-lg px-3 py-1.5 text-sm text-forest-700 dark:text-cream-100">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => { setReplying(r.id); setDraft(''); }} className="mt-2 text-sm font-medium text-forest-700 hover:underline dark:text-gold-400">
                  Respond
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </ThreadCard>
  );
}
