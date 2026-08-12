'use client';

import { useEffect, useRef, useState } from 'react';
import { listListings, type ListingSummary } from '@/lib/marketplace-client';
import { ListingCard } from '@/components/marketplace/ListingCard';

type TabKey = 'popular' | 'newest' | 'featured' | 'rating';

const TABS: { key: TabKey; label: string; param: { sort?: 'newest' | 'popular' | 'rating'; featured?: boolean } }[] = [
  { key: 'popular', label: 'Popular', param: { sort: 'popular' } },
  { key: 'newest', label: 'New', param: { sort: 'newest' } },
  { key: 'featured', label: 'Featured', param: { featured: true } },
  { key: 'rating', label: 'Top Rated', param: { sort: 'rating' } },
];

const ROTATE_MS = 6000;

export function ListingShowcase() {
  const [active, setActive] = useState<TabKey>('popular');
  const [listings, setListings] = useState<ListingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch listings for the active tab from the live API.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const tab = TABS.find((t) => t.key === active)!;
    listListings({ ...tab.param, limit: 4 })
      .then((res) => {
        if (!cancelled) setListings(res.listings ?? []);
      })
      .catch(() => {
        if (!cancelled) setListings([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [active]);

  // Auto-rotate tabs.
  useEffect(() => {
    timer.current = setInterval(() => {
      setActive((cur) => {
        const idx = TABS.findIndex((t) => t.key === cur);
        const next = (idx + 1) % TABS.length;
        return TABS[next]?.key ?? 'popular';
      });
    }, ROTATE_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  const handleTab = (key: TabKey) => {
    setActive(key);
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setActive((cur) => {
        const idx = TABS.findIndex((t) => t.key === cur);
        const next = (idx + 1) % TABS.length;
        return TABS[next]?.key ?? 'popular';
      });
    }, ROTATE_MS);
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => handleTab(tab.key)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              active === tab.key
                ? 'bg-forest-700 text-cream-100 shadow-sm'
                : 'bg-cream-100 text-forest-700 hover:bg-cream-200 dark:bg-forest-800 dark:text-cream-100 dark:hover:bg-forest-700'
            }`}
            aria-pressed={active === tab.key}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[320px]">
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square animate-pulse rounded-2xl bg-cream-200/70 dark:bg-forest-800/60"
          />
          ))}
          </div>
        ) : listings.length === 0 ? (
          <p className="py-16 text-center text-sm text-forest-700/60 dark:text-cream-100/60">
            No listings in this category yet — be the first to list.
          </p>
        ) : (
          <div
            key={active}
            className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6 [animation:fadeIn_0.4s_ease]"
          >
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
