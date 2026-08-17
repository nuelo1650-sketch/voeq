'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { type FormEvent } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SearchIcon, XIcon } from '@/components/icons';
import { SearchInput } from '@/components/ui/SearchInput';
import { EmptyState } from '@/components/ui/EmptyState';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { CategoryPill } from '@/components/marketplace/CategoryPill';
import { AnimatedSection } from '@/components/landing/AnimatedSection';
import type { ListListingsResult, CategorySummary } from '@/lib/marketplace-client';

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Trending' },
];

export function BrowseClient({
  listings,
  categories,
  total,
  activeFilters,
}: {
  listings: ListListingsResult['listings'];
  categories: CategorySummary[];
  total: number;
  activeFilters: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get('search') ?? '';
  const currentCategory = searchParams.get('category') ?? '';
  const currentSort = searchParams.get('sort') ?? 'newest';
  const currentMinPrice = searchParams.get('minPrice') ?? '';
  const currentMaxPrice = searchParams.get('maxPrice') ?? '';
  const currentMinRating = searchParams.get('minRating') ?? '';
  const currentVerified = searchParams.get('verifiedOnly') === 'true';

  // Build a query string that preserves the meaningful params.
  const buildQuery = (overrides: Record<string, string | undefined>) => {
    const sp = new URLSearchParams();
    const search = overrides.search ?? currentSearch;
    const category = overrides.category ?? currentCategory;
    const sort = overrides.sort ?? currentSort;
    const minPrice = overrides.minPrice ?? currentMinPrice;
    const maxPrice = overrides.maxPrice ?? currentMaxPrice;
    const minRating = overrides.minRating ?? currentMinRating;
    const verifiedOnly = overrides.verifiedOnly ?? (currentVerified ? 'true' : undefined);
    if (search) sp.set('search', search);
    if (category) sp.set('category', category);
    if (sort && sort !== 'newest') sp.set('sort', sort);
    if (minPrice) sp.set('minPrice', minPrice);
    if (maxPrice) sp.set('maxPrice', maxPrice);
    if (minRating) sp.set('minRating', minRating);
    if (verifiedOnly) sp.set('verifiedOnly', verifiedOnly);
    return sp.toString();
  };

  const pushQuery = (overrides: Record<string, string | undefined>) => {
    const qs = buildQuery(overrides);
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <>
      <AnimatedSection>
        <div className="mb-6">
          <p className="text-sm text-forest-700/60 dark:text-cream-100/60">
            {total > 0 ? `${total} ${total === 1 ? 'result' : 'results'}` : 'No results'}
          </p>
        </div>
      </AnimatedSection>

      <form
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          pushQuery({ search: (currentSearch || '').trim() || undefined });
        }}
        className="mb-6"
      >
        <SearchInput
          placeholder="Search vendors, listings, or categories..."
          defaultValue={currentSearch}
          className="w-full"
          size="lg"
        />
      </form>

      <AnimatedSection>
        <div className="-mx-6 mb-6 overflow-x-auto px-6 pb-2">
          <div className="flex gap-2">
            <CategoryPill slug="" name="All" iconName="OtherIcon" active={!currentCategory} href="/browse" />
            {categories.map((cat) => (
              <CategoryPill
                key={cat.id}
                slug={cat.slug}
                name={cat.name}
                iconName={cat.iconName}
                active={currentCategory === cat.slug}
                href={`/browse?category=${cat.slug}`}
              />
            ))}
          </div>
        </div>
      </AnimatedSection>

      <details className="mb-6 rounded-2xl border border-cream-300 bg-cream-50 p-4 dark:border-forest-700 dark:bg-forest-800 dark:border-cream-100">
        <summary className="cursor-pointer text-sm font-medium text-forest-900 dark:text-cream-100">More filters</summary>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1 text-xs font-medium text-forest-700/70 dark:text-cream-100/70">
            Min price (₦)
            <input
              type="number"
              min={0}
              inputMode="numeric"
              defaultValue={currentMinPrice}
              placeholder="0"
              onBlur={(e) => pushQuery({ minPrice: e.target.value || undefined })}
              className="rounded-md border border-cream-300 bg-cream-50 px-3 py-1.5 text-sm text-forest-900 outline-none focus:border-forest-700 dark:border-forest-700 dark:bg-forest-900/60 dark:text-cream-100"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-forest-700/70 dark:text-cream-100/70">
            Max price (₦)
            <input
              type="number"
              min={0}
              inputMode="numeric"
              defaultValue={currentMaxPrice}
              placeholder="Any"
              onBlur={(e) => pushQuery({ maxPrice: e.target.value || undefined })}
              className="rounded-md border border-cream-300 bg-cream-50 px-3 py-1.5 text-sm text-forest-900 outline-none focus:border-forest-700 dark:border-forest-700 dark:bg-forest-900/60 dark:text-cream-100"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-forest-700/70 dark:text-cream-100/70">
            Min rating
            <select
              value={currentMinRating}
              onChange={(e) => pushQuery({ minRating: e.target.value || undefined })}
              className="rounded-md border border-cream-300 bg-cream-50 px-3 py-1.5 text-sm text-forest-900 dark:border-forest-700 dark:bg-forest-800 dark:text-cream-100"
            >
              <option value="">Any</option>
              <option value="3">3+ stars</option>
              <option value="4">4+ stars</option>
              <option value="4.5">4.5+ stars</option>
            </select>
          </label>
          <label className="flex items-end gap-3 text-sm font-medium text-forest-900 dark:text-cream-100">
            <input
              type="checkbox"
              checked={currentVerified}
              onChange={(e) => pushQuery({ verifiedOnly: e.target.checked ? 'true' : undefined })}
              className="h-4 w-4 rounded border-cream-300 text-forest-700 focus:ring-forest-700"
            />
            Verified only
          </label>
        </div>
      </details>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm text-forest-700/60 dark:text-cream-100/60 sm:inline">Sort:</span>
        <select
          value={currentSort}
          onChange={(e) => pushQuery({ sort: e.target.value === 'newest' ? undefined : e.target.value })}
          className="rounded-md border border-cream-300 bg-cream-50 px-3 py-1.5 text-sm dark:border-forest-700 dark:bg-forest-800 dark:border-cream-100"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {activeFilters > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-sm text-forest-700/60 dark:text-cream-100/60">Active filters:</span>
          {currentSearch && (
            <span className="inline-flex items-center gap-1 rounded-full border border-gold-500 bg-gold-500/10 px-2 py-0.5 text-xs font-medium text-forest-900 dark:text-cream-100">
              Search: {currentSearch}
              <button type="button" onClick={() => pushQuery({ search: undefined })} className="text-forest-700/60 hover:text-forest-900 dark:text-cream-100/60">
                <XIcon className="h-3 w-3" />
              </button>
            </span>
          )}
          {currentMinPrice && (
            <span className="inline-flex items-center gap-1 rounded-full border border-gold-500 bg-gold-500/10 px-2 py-0.5 text-xs font-medium text-forest-900 dark:text-cream-100">
              Min ₦{currentMinPrice}
              <button type="button" onClick={() => pushQuery({ minPrice: undefined })} className="text-forest-700/60 hover:text-forest-900 dark:text-cream-100/60">
                <XIcon className="h-3 w-3" />
              </button>
            </span>
          )}
          {currentMaxPrice && (
            <span className="inline-flex items-center gap-1 rounded-full border border-gold-500 bg-gold-500/10 px-2 py-0.5 text-xs font-medium text-forest-900 dark:text-cream-100">
              Max ₦{currentMaxPrice}
              <button type="button" onClick={() => pushQuery({ maxPrice: undefined })} className="text-forest-700/60 hover:text-forest-900 dark:text-cream-100/60">
                <XIcon className="h-3 w-3" />
              </button>
            </span>
          )}
          {currentMinRating && (
            <span className="inline-flex items-center gap-1 rounded-full border border-gold-500 bg-gold-500/10 px-2 py-0.5 text-xs font-medium text-forest-900 dark:text-cream-100">
              {currentMinRating}+ stars
              <button type="button" onClick={() => pushQuery({ minRating: undefined })} className="text-forest-700/60 hover:text-forest-900 dark:text-cream-100/60">
                <XIcon className="h-3 w-3" />
              </button>
            </span>
          )}
          {currentVerified && (
            <span className="inline-flex items-center gap-1 rounded-full border border-gold-500 bg-gold-500/10 px-2 py-0.5 text-xs font-medium text-forest-900 dark:text-cream-100">
              Verified only
              <button type="button" onClick={() => pushQuery({ verifiedOnly: undefined })} className="text-forest-700/60 hover:text-forest-900 dark:text-cream-100/60">
                <XIcon className="h-3 w-3" />
              </button>
            </span>
          )}
          <button type="button" onClick={() => router.push(pathname)} className="text-xs text-forest-700/60 hover:underline dark:text-cream-100/60">
            Clear all
          </button>
        </div>
      )}

      {listings.length === 0 ? (
        <AnimatedSection>
          <EmptyState
            icon={<SearchIcon className="h-16 w-16 text-forest-700/30 dark:text-cream-100/30" />}
            title="No results found"
            description="Try adjusting your filters or search terms"
            action={{ label: 'Clear filters', onClick: () => router.push(pathname) }}
          />
        </AnimatedSection>
      ) : (
        <AnimatedSection>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">
              {currentCategory ? categories.find((c) => c.slug === currentCategory)?.name ?? 'Listings' : 'All listings'}
            </h2>
            <span className="text-sm text-forest-700/60 dark:text-cream-100/60">{total} results</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </AnimatedSection>
      )}
    </>
  );
}
