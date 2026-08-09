'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { type FormEvent } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SearchIcon, XIcon, MapIcon } from '@/components/icons';
import { SearchInput } from '@/components/ui/SearchInput';
import { EmptyState } from '@/components/ui/EmptyState';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { CategoryPill } from '@/components/marketplace/CategoryPill';
import { AnimatedSection } from '@/components/landing/AnimatedSection';
import type { ListListingsResult, CategorySummary } from '@/lib/marketplace-client';

export function BrowseClient({
  listings,
  categories,
  total,
  view,
  trending,
  activeFilters,
}: {
  listings: ListListingsResult['listings'];
  categories: CategorySummary[];
  total: number;
  view: 'grid' | 'list' | 'map';
  trending: boolean;
  activeFilters: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get('search') ?? '';
  const currentCategory = searchParams.get('category') ?? '';
  const currentSort = searchParams.get('sort') ?? 'newest';
  const currentView = (searchParams.get('view') as 'grid' | 'list' | 'map') ?? 'grid';
  const isTrending = searchParams.get('trending') === 'true';

  const updateParams = (updates: Record<string, string | boolean | undefined>) => {
    const sp = new URLSearchParams();
    if (currentSearch) sp.set('search', currentSearch);
    if (currentCategory) sp.set('category', currentCategory);
    const sort = updates.sort ?? currentSort;
    if (sort && sort !== 'newest') sp.set('sort', String(sort));
    const view = updates.view ?? currentView;
    if (view && view !== 'grid') sp.set('view', String(view));
    const trending = updates.trending ?? isTrending;
    if (trending) sp.set('trending', 'true');
    router.push(`${pathname}?${sp.toString()}`);
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
          const q = (currentSearch || '').trim();
          const sp = new URLSearchParams();
          if (q) sp.set('search', q);
          if (currentCategory) sp.set('category', currentCategory);
          if (currentSort && currentSort !== 'newest') sp.set('sort', currentSort);
          if (currentView && currentView !== 'grid') sp.set('view', currentView);
          if (isTrending) sp.set('trending', 'true');
          router.push(`${pathname}?${sp.toString()}`);
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
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => updateParams({ trending: true })}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition',
              isTrending
                ? 'border-gold-500 bg-gold-500/10 text-forest-900 dark:text-cream-100'
                : 'border-cream-300 bg-cream-50 text-forest-700 hover:border-gold-500/50 dark:border-forest-700 dark:bg-forest-800 dark:text-cream-100',
            )}
          >
            Trending this week
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-forest-700/60 dark:text-cream-100/60 sm:inline">Sort:</span>
          <select
            value={currentSort}
            onChange={(e) => updateParams({ sort: e.target.value })}
            className="rounded-md border border-cream-300 bg-cream-50 px-3 py-1.5 text-sm dark:border-forest-700 dark:bg-forest-800"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="popular">Trending this week</option>
          </select>
        </div>
      </div>

      {activeFilters > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-sm text-forest-700/60 dark:text-cream-100/60">Active filters:</span>
          {currentSearch && (
            <span className="inline-flex items-center gap-1 rounded-full border border-gold-500 bg-gold-500/10 px-2 py-0.5 text-xs font-medium text-forest-900 dark:text-cream-100">
              Search: {currentSearch}
              <button type="button" onClick={() => router.push(pathname)} className="text-forest-700/60 hover:text-forest-900 dark:text-cream-100/60">
                <XIcon className="h-3 w-3" />
              </button>
            </span>
          )}
          {currentCategory && (
            <span className="inline-flex items-center gap-1 rounded-full border border-gold-500 bg-gold-500/10 px-2 py-0.5 text-xs font-medium text-forest-900 dark:text-cream-100">
              Category: {currentCategory}
              <button
                type="button"
                onClick={() => {
                  const sp = new URLSearchParams();
                  if (currentSearch) sp.set('search', currentSearch);
                  if (currentSort && currentSort !== 'newest') sp.set('sort', currentSort);
                  if (currentView && currentView !== 'grid') sp.set('view', currentView);
                  if (isTrending) sp.set('trending', 'true');
                  router.push(`${pathname}?${sp.toString()}`);
                }}
                className="text-forest-700/60 hover:text-forest-900 dark:text-cream-100/60"
              >
                <XIcon className="h-3 w-3" />
              </button>
            </span>
          )}
          <button type="button" onClick={() => router.push(pathname)} className="text-xs text-forest-700/60 hover:underline dark:text-cream-100/60">
            Clear all
          </button>
        </div>
      )}

      {view === 'map' ? (
        <MapView listings={listings} />
      ) : listings.length === 0 ? (
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
          <div className={cn('grid gap-3 sm:gap-4', view === 'list' ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4')}>
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </AnimatedSection>
      )}
    </>
  );
}

function MapView({ listings }: { listings: ListListingsResult['listings'] }) {
  return (
    <div className="rounded-2xl border border-cream-300 bg-cream-50 p-12 text-center dark:border-forest-700 dark:bg-forest-800">
      <MapIcon className="mx-auto h-12 w-12 text-forest-700/30 dark:text-cream-100/30" />
      <h3 className="mt-4 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">Map view</h3>
      <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">
        Map view shows {listings.length} {listings.length === 1 ? 'vendor' : 'vendors'} on a campus map.
      </p>
      <p className="mt-1 text-xs text-forest-700/60 dark:text-cream-100/60">
        Full map implementation coming soon — for now, browse using grid view
      </p>
    </div>
  );
}
