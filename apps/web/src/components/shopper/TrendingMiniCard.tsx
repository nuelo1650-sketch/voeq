'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getTrending, type TrendingItem } from '@/lib/analytics-client';

export function TrendingMiniCard({ campusId }: { campusId?: string | null }) {
  const [items, setItems] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!campusId) {
      setLoading(false);
      return;
    }
    getTrending(campusId, 6)
      .then((r) => setItems(r.items))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [campusId]);

  if (loading) return <p className="text-sm text-forest-700/60 dark:text-cream-100/60">Loading…</p>;
  if (items.length === 0)
    return <p className="text-sm text-forest-700/70 dark:text-cream-100/70">No trending activity on your campus yet.</p>;

  return (
    <ul className="space-y-2">
      {items.map((it, i) => {
        const href = it.kind === 'listing' ? `/l/${it.slug}` : `/v/${it.slug}`;
        return (
          <li key={`${it.kind}:${it.id}`}>
            <Link href={href} className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-cream-100/50 dark:hover:bg-forest-700/30">
              <span className="w-4 text-sm font-semibold text-gold-600 dark:text-gold-400">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-forest-900 dark:text-cream-100">{it.title}</p>
                <p className="text-xs text-forest-700/50 dark:text-cream-100/50">{it.kind === 'listing' ? 'Listing' : 'Vendor'} · {it.views} views</p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
