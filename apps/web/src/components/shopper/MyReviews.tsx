'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { listMyReviews, deleteReview, updateReview, type Review } from '@/lib/review-client';
import { RatingStars } from '@/components/marketplace/RatingStars';

interface MyReview {
  id: string;
  vendorId: string;
  rating: number;
  text: string;
  status: string;
  vendorResponse: string | null;
  createdAt: string;
  vendor: { businessName: string; businessSlug: string };
  listing: { title: string; slug: string } | null;
}

export function MyReviews() {
  const [reviews, setReviews] = useState<MyReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  const load = () => {
    listMyReviews()
      .then((r) => setReviews(r.reviews as MyReview[]))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDelete = async (id: string) => {
    if (!confirm('Delete this review? This cannot be undone.')) return;
    await deleteReview(id).catch(() => {});
    load();
  };

  const onSave = async (id: string) => {
    const text = draft.trim();
    if (!text) return;
    await updateReview(id, { text }).catch(() => {});
    setEditing(null);
    setDraft('');
    load();
  };

  if (loading) return <p className="text-sm text-forest-700/60 dark:text-cream-100/60">Loading…</p>;
  if (reviews.length === 0)
    return <p className="text-sm text-forest-700/70 dark:text-cream-100/70">You haven&apos;t reviewed any vendors yet.</p>;

  return (
    <ul className="space-y-3">
      {reviews.map((r) => (
        <li key={r.id} className="rounded-xl border border-cream-200 p-3 dark:border-forest-700 dark:border-cream-100">
          <div className="flex items-center justify-between">
            <Link href={`/v/${r.vendor.businessSlug}`} className="text-sm font-semibold text-forest-900 hover:underline dark:text-cream-100">
              {r.vendor.businessName}
            </Link>
            <RatingStars rating={r.rating} size="sm" />
          </div>
          {editing === r.id ? (
            <div className="mt-2">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={2}
                className="w-full resize-none rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-forest-900 outline-none focus:border-forest-700 dark:border-forest-700 dark:bg-forest-800 dark:border-cream-100 dark:text-cream-100"
              />
              <div className="mt-2 flex gap-2">
                <button onClick={() => onSave(r.id)} className="rounded-lg bg-gold-500 px-3 py-1.5 text-sm font-semibold text-forest-900">Save</button>
                <button onClick={() => { setEditing(null); setDraft(''); }} className="rounded-lg px-3 py-1.5 text-sm text-forest-700 dark:text-cream-100">Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <p className="mt-1.5 text-sm text-forest-900 dark:text-cream-100">{r.text}</p>
              {r.vendorResponse && (
                <p className="mt-2 rounded-lg bg-cream-100 px-3 py-2 text-sm text-forest-700 dark:bg-forest-900/50 dark:text-cream-100/80">{r.vendorResponse}</p>
              )}
              <div className="mt-2 flex gap-3 text-xs font-medium">
                <button onClick={() => { setEditing(r.id); setDraft(r.text); }} className="text-forest-700 hover:underline dark:text-gold-400">Edit</button>
                <button onClick={() => onDelete(r.id)} className="text-red-600 hover:underline dark:text-red-400">Delete</button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
