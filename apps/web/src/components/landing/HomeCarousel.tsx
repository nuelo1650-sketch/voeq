'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { listListings, type ListingSummary } from '@/lib/marketplace-client';

type Listing = ListingSummary;

const SECTIONS = [
  { key: 'recent', label: 'Recently joined', sort: 'newest' as const },
  { key: 'popular', label: 'Popular on Voeq', sort: 'popular' as const },
  { key: 'top', label: 'Top rated near you', sort: 'rating' as const },
  { key: 'nearby', label: 'Best value', sort: 'price_asc' as const },
] as const;

type SectionKey = (typeof SECTIONS)[number]['key'];

interface HomeCarouselProps {
  campusId: string;
}

export function HomeCarousel({ campusId }: HomeCarouselProps) {
  const [index, setIndex] = useState(0);
  const [listingsByKey, setListingsByKey] = useState<Record<SectionKey, ListingSummary[]>>({
    recent: [],
    popular: [],
    top: [],
    nearby: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchListings = async () => {
      setLoading(true);
      try {
        const section = SECTIONS[index];
        if (!section) return;
        const result = await listListings({ campusId, sort: section.sort, limit: 4 });
        if (!cancelled) {
          setListingsByKey((prev) => ({
            ...prev,
            [section.key]: result.listings,
          }));
        }
      } catch {
        // keep existing listings on error
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchListings();
    return () => {
      cancelled = true;
    };
  }, [campusId, index]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SECTIONS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const section = SECTIONS[index] ?? SECTIONS[0];
  const listings = listingsByKey[section.key] ?? [];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-cream-300 bg-cream-50 dark:border-forest-700 dark:bg-forest-800">
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">{section.label}</h2>
        </div>
        <a href={`/browse?sort=${section.sort}`} className="text-sm font-medium text-forest-700 hover:underline dark:text-gold-500">
          View all →
        </a>
      </div>

      <div className="absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-2">
        {SECTIONS.map((item, itemIndex) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setIndex(itemIndex)}
            className={`h-2 rounded-full transition ${
              index === itemIndex ? 'w-6 bg-forest-900 dark:bg-cream-100' : 'w-2 bg-forest-700/20 dark:bg-cream-100/40'
            }`}
            aria-label={item.label}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={section.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
          className="px-6 pt-20 pb-6"
        >
          {loading && listings.length === 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-40 animate-pulse rounded-xl bg-cream-200 dark:bg-forest-700" />
              ))}
            </div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <p className="py-10 text-center text-sm text-forest-700/60 dark:text-cream-100/60">No listings yet</p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
