import { type Metadata } from 'next';
import { type ListListingsParams, type ListListingsResult, getCategories, listListings } from '@/lib/marketplace-client';
import { getMe } from '@/lib/auth-client';
import { Container } from '@/components/ui/Container';
import { VendorPageHeader, VendorSection } from '@/components/vendor/VendorPageShell';
import { BrowseClient } from './BrowseClient';

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
      <>
        <VendorPageHeader title="Browse vendors" subtitle="Please select a campus to continue." />
        <VendorSection>
          <Container size="md">
            <div className="py-16 text-center text-sm text-forest-700/60 dark:text-cream-100/60">
              Please select a campus to continue.
            </div>
          </Container>
        </VendorSection>
      </>
    );
  }

  const trending = params.trending === 'true';
  const querySort: ListListingsParams['sort'] = trending ? 'popular' : ((params.sort ?? 'newest') as ListListingsParams['sort']);

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

  const { listings, total } = result;
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
    <BrowseClient
      listings={listings}
      categories={categories}
      total={total}
      view={view}
      trending={trending}
      activeFilters={activeFilters}
    />
  );
}
