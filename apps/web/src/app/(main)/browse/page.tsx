import { type Metadata } from 'next';
import Link from 'next/link';
import { type ListListingsParams, type ListListingsResult, getCategories, listListings } from '@/lib/marketplace-client';
import { getMe } from '@/lib/auth-client';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { CategoryPill } from '@/components/marketplace/CategoryPill';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { SearchIcon, XIcon, MapIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Browse',
  description: 'Browse verified campus vendors by category, price, rating, and location.',
};

interface BrowsePageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    campusId?: string;
    minPrice?: string;
    maxPrice?: string;
    minRating?: string;
    verifiedOnly?: string;
    sort?: string;
    view?: string;
    trending?: string;
  }>;
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const params = await searchParams;
  const me = await getMe().catch(() => null);
  const campusId = params.campusId ?? me?.user?.defaultCampusId;
  const campusName = me?.user?.defaultCampus?.name ?? '';
  const institutionName = me?.user?.defaultCampus?.institution.name ?? '';

  if (!campusId) {
    return (
      <Section spacing="lg">
        <Container size="md">
          <p className="py-16 text-center text-sm text-forest-700/60 dark:text-cream-100/60">
            Please select a campus to continue.
          </p>
        </Container>
      </Section>
    );
  }

  const trending = params.trending === 'true';
  const querySort = trending ? 'popular' : ((params.sort ?? 'newest') as ListListingsParams['sort']);

  const query = {
    campusId,
    category: params.category,
    search: params.search,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    minRating: params.minRating ? Number(params.minRating) : undefined,
    verifiedOnly: params.verifiedOnly === 'true',
    sort: querySort,
    limit: 20,
    page: 1,
  };

  const [result, categoriesResult] = await Promise.all([
    listListings(query).catch(() => ({ listings: [], total: 0, page: 1, totalPages: 0, facets: { categories: [], priceRange: { min: 0, max: 100000 } } })),
    getCategories().catch(() => ({ categories: [] })),
  ]);

  const { listings, total, facets } = result;
  const categories = categoriesResult.categories;
  const view = (params.view as 'grid' | 'list' | 'map') ?? 'grid';

  const activeFilters = [
    params.search,
    params.category,
    params.campusId,
    params.minPrice,
    params.maxPrice,
    params.minRating,
    params.verifiedOnly,
  ].filter(Boolean).length;

  return (
    <Section spacing="md">
      <Container size="xl">
        <div className="mb-6">
          <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">Browse vendors</h1>
          <p className="mt-1 text-sm text-forest-700/70 dark:text-cream-100/70">
            {total > 0 ? `${total} ${total === 1 ? 'result' : 'results'}` : 'No results'}
          </p>
        </div>

        <div className="mb-6">
          <SearchInput
            placeholder="Search vendors, listings, or categories..."
            defaultValue={params.search ?? ''}
            className="w-full"
            size="lg"
          />
        </div>

        <div className="-mx-6 mb-6 overflow-x-auto px-6 pb-2">
          <div className="flex gap-2">
            <CategoryPill slug="" name="All" iconName="OtherIcon" active={!params.category} href="/browse" />
            {categories.map((cat) => (
              <CategoryPill
                key={cat.id}
                slug={cat.slug}
                name={cat.name}
                iconName={cat.iconName}
                active={params.category === cat.slug}
                href={`/browse?category=${cat.slug}`}
              />
            ))}
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Link
              href={`/browse?${new URLSearchParams({ ...(params.category ? { category: params.category } : {}), trending: 'true' }).toString()}`}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition',
                trending
                  ? 'border-gold-500 bg-gold-500/10 text-forest-900 dark:text-cream-100'
                  : 'border-cream-300 bg-cream-50 text-forest-700 hover:border-gold-500/50 dark:border-forest-700 dark:bg-forest-800 dark:text-cream-100',
              )}
            >
              Trending this week
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-forest-700/60 dark:text-cream-100/60 sm:inline">Sort:</span>
            <select
              defaultValue={query.sort}
              onChange={(e) => {
                const url = new URL('/browse', typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL ?? ''));
                if (params.category) url.searchParams.set('category', params.category);
                if (params.search) url.searchParams.set('search', params.search);
                url.searchParams.set('sort', e.target.value);
                if (typeof window !== 'undefined') window.location.href = url.toString();
              }}
              className="rounded-md border border-cream-300 bg-cream-50 px-3 py-1.5 text-sm dark:border-forest-700 dark:bg-forest-800"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Trending this week</option>
              <option value="popular">Most Viewed</option>
            </select>
          </div>
        </div>

        {activeFilters > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-sm text-forest-700/60 dark:text-cream-100/60">Active filters:</span>
            {params.search && (
              <Badge variant="gold">
                Search: {params.search}
                <Link href="/browse" className="ml-1">
                  <XIcon className="h-3 w-3" />
                </Link>
              </Badge>
            )}
            {params.category && (
              <Badge variant="gold">
                Category: {params.category}
                <Link href="/browse" className="ml-1">
                  <XIcon className="h-3 w-3" />
                </Link>
              </Badge>
            )}
            <Link href="/browse" className="text-xs text-forest-700/60 hover:underline dark:text-cream-100/60">
              Clear all
            </Link>
          </div>
        )}

        {view === 'map' ? (
          <MapView listings={listings} />
        ) : listings.length === 0 ? (
          <EmptyState
            icon={<SearchIcon className="h-16 w-16 text-forest-700/30 dark:text-cream-100/30" />}
            title="No results found"
            description="Try adjusting your filters or search terms"
            action={{ label: 'Clear filters', onClick: () => { if (typeof window !== 'undefined') window.location.href = '/browse'; } }}
          />
        ) : (
          <div className={cn('grid gap-3 sm:gap-4', view === 'list' ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4')}>
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </Container>
    </Section>
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
