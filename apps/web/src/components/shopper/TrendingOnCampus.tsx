'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TrendingUpIcon } from '@/components/icons';
import { getTrending, type TrendingItem } from '@/lib/analytics-client';

export function TrendingOnCampus({ campusId }: { campusId: string | null | undefined }) {
  const [items, setItems] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!campusId) {
      setLoading(false);
      return;
    }
    let active = true;
    getTrending(campusId, 8)
      .then((res) => {
        if (active) setItems(res.items);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [campusId]);

  if (!campusId) return null;
  if (loading) {
    return (
      <section className="mt-8">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-forest-900 dark:text-cream-100">
          <TrendingUpIcon className="h-5 w-5 text-gold-500" /> Trending on your campus
        </h2>
        <p className="text-sm text-forest-700/60 dark:text-cream-100/60">Loading…</p>
      </section>
    );
  }
  if (items.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-forest-900 dark:text-cream-100">
        <TrendingUpIcon className="h-5 w-5 text-gold-500" /> Trending on your campus
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => {
          const href = item.kind === 'listing' ? `/l/${item.slug}` : `/v/${item.slug}`;
          return (
            <Link
              key={`${item.kind}-${item.id}`}
              href={href}
              className="group overflow-hidden rounded-2xl border border-cream-200 bg-cream-50 transition hover:shadow-md dark:border-forest-700 dark:bg-forest-800 dark:border-cream-100"
            >
              <div className="relative aspect-[4/3] bg-cream-100 dark:bg-forest-700">
                {item.photoUrl ? (
                  <Image
                    src={item.photoUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-2xl font-semibold text-forest-700/40 dark:text-cream-100/40">
                    {item.kind === 'listing' ? '🛍️' : '🏪'}
                  </div>
                )}
                <span className="absolute left-2 top-2 rounded-full bg-forest-900/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-cream-100">
                  {item.kind === 'listing' ? 'Listing' : 'Vendor'}
                </span>
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-medium text-forest-900 dark:text-cream-100">{item.title}</p>
                {item.categoryName && (
                  <p className="truncate text-xs text-forest-700/60 dark:text-cream-100/60">{item.categoryName}</p>
                )}
                <p className="mt-1 text-xs text-forest-700/50 dark:text-cream-100/50">{item.views} views this week</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
