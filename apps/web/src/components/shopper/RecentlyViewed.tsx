'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getRecentlyViewed, type RecentlyViewedItem } from '@/lib/analytics-client';

export function RecentlyViewed() {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecentlyViewed()
      .then((r) => setItems(r.items.slice(0, 10)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-sm text-forest-700/60 dark:text-cream-100/60">Loading…</p>;
  }
  if (items.length === 0) {
    return <p className="text-sm text-forest-700/70 dark:text-cream-100/70">Nothing viewed yet. Browse vendors and listings to populate this.</p>;
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {items.map((it) => {
        const href = it.kind === 'listing' ? `/l/${it.slug}` : `/v/${it.slug}`;
        return (
          <Link
            key={`${it.kind}:${it.id}`}
            href={href}
            className="group w-40 shrink-0 rounded-xl border border-cream-200 p-2 transition hover:shadow-sm dark:border-forest-700 dark:border-cream-100"
          >
            <div className="flex h-20 w-full items-center justify-center overflow-hidden rounded-lg bg-cream-100 dark:bg-forest-900/60">
              {it.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={it.photoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs text-forest-700/50 dark:text-cream-100/50">{it.kind === 'listing' ? 'Listing' : 'Vendor'}</span>
              )}
            </div>
            <p className="mt-1.5 truncate text-xs font-medium text-forest-900 dark:text-cream-100">{it.title}</p>
            {it.categoryName && <p className="truncate text-[10px] text-forest-700/50 dark:text-cream-100/50">{it.categoryName}</p>}
          </Link>
        );
      })}
    </div>
  );
}
