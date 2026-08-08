import { type Metadata } from 'next';
import { listListings, getCategories } from '@/lib/marketplace-client';
import { getMe } from '@/lib/auth-client';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { CategoryPill } from '@/components/marketplace/CategoryPill';
import { CampusContextBar } from '@/components/marketplace/CampusContextBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { NoResults } from '@/components/illustrations';
import { Button } from '@/components/ui/Button';
import { ArrowRightIcon } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Browse',
  description: 'Browse all vendors and listings on Voeq. Filter by category and campus.',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

interface BrowsePageProps {
  searchParams: Promise<{ category?: string; sort?: string }>;
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const params = await searchParams;
  const me = await getMe().catch(() => null);
  const campusId = me?.user.defaultCampusId;
  const campusName = me?.user.defaultCampus?.name ?? '';
  const institutionName = me?.user.defaultCampus?.institution.name ?? '';

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

  const [listingsResult, categoriesResult] = await Promise.all([
    listListings({ campusId, category: params.category, sort: params.sort as any, limit: 40 }).catch(() => null),
    getCategories().catch(() => null),
  ]);

  const listings = listingsResult?.listings ?? [];
  const categories = categoriesResult?.categories ?? [];
  const activeCategory = params.category;
  const activeSort = params.sort ?? 'newest';

  return (
    <>
      <CampusContextBar
        campusId={campusId}
        campusName={campusName}
        institutionName={institutionName}
      />

      <Section spacing="md">
        <Container size="lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100 sm:text-3xl">
              Browse
            </h1>
            <div className="flex items-center gap-2">
              <Button
                variant={activeSort === 'newest' ? 'primary' : 'ghost'}
                size="sm"
                asChild
              >
                <a href={`/browse?${new URLSearchParams({ ...(activeCategory ? { category: activeCategory } : {}), sort: 'newest' }).toString()}`}>Newest</a>
              </Button>
              <Button
                variant={activeSort === 'price_asc' ? 'primary' : 'ghost'}
                size="sm"
                asChild
              >
                <a href={`/browse?${new URLSearchParams({ ...(activeCategory ? { category: activeCategory } : {}), sort: 'price_asc' }).toString()}`}>Price: Low to High</a>
              </Button>
              <Button
                variant={activeSort === 'price_desc' ? 'primary' : 'ghost'}
                size="sm"
                asChild
              >
                <a href={`/browse?${new URLSearchParams({ ...(activeCategory ? { category: activeCategory } : {}), sort: 'price_desc' }).toString()}`}>Price: High to Low</a>
              </Button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {activeCategory && (
              <span className="inline-flex items-center gap-1 rounded-full bg-forest-700 px-3 py-1 text-xs font-medium text-cream-100">
                {activeCategory}
                <a href="/browse" className="ml-1 text-cream-100/80 hover:text-cream-100">×</a>
              </span>
            )}
            <span className="text-xs text-forest-700/60 dark:text-cream-100/60">
              {listings.length} {listings.length === 1 ? 'result' : 'results'}
            </span>
          </div>

          <div className="mt-6 -mx-6 overflow-x-auto px-6 pb-2">
            <div className="flex gap-2">
              <CategoryPill slug="" name="All" iconName="OtherIcon" active={!activeCategory} href="/browse" />
              {categories.map((cat) => (
                <CategoryPill
                  key={cat.slug}
                  slug={cat.slug}
                  name={cat.name}
                  iconName={cat.iconName}
                  active={activeCategory === cat.slug}
                  href={`/browse?category=${cat.slug}`}
                />
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="md">
        <Container size="lg">
          {listings.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-sm text-forest-700/60 dark:text-cream-100/60">
              <NoResults className="mx-auto mb-4 h-12 w-12 text-forest-700/40 dark:text-cream-100/40" />
              No listings found. Try a different category or <a className="text-forest-700 underline dark:text-gold-500" href="/browse">browse all</a>.
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
