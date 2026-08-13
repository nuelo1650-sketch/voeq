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

  // Build a query string that preserves the meaningful params.
  const buildQuery = (overrides: Record<string, string | undefined>) => {
    const sp = new URLSearchParams();
    const search = overrides.search ?? currentSearch;
    const category = overrides.category ?? currentCategory;
    const sort = overrides.sort ?? currentSort;
    if (search) sp.set('search', search);
    if (category) sp.set('category', category);
    if (sort && sort !== 'newest') sp.set('sort', sort);
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

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm text-forest-700/60 dark:text-cream-100/60 sm:inline">Sort:</span>
        <select
          value={currentSort}
          onChange={(e) => pushQuery({ sort: e.target.value === 'newest' ? undefined : e.target.value })}
          className="rounded-md border border-cream-300 bg-cream-50 px-3 py-1.5 text-sm dark:border-forest-700 dark:bg-forest-800"
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
          {currentCategory && (
            <span className="inline-flex items-center gap-1 rounded-full border border-gold-500 bg-gold-500/10 px-2 py-0.5 text-xs font-medium text-forest-900 dark:text-cream-100">
              Category: {currentCategory}
              <button type="button" onClick={() => pushQuery({ category: undefined })} className="text-forest-700/60 hover:text-forest-900 dark:text-cream-100/60">
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
