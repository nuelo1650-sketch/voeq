import { type Metadata } from 'next';
import { type ListListingsParams, type ListListingsResult } from '@/lib/marketplace-client';
import { serverGetCategories as getCategories, serverListListings as listListings } from '@/lib/marketplace-server';
import { serverGetMe as getMe } from '@/lib/auth-server';
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
  }>;
}

async function fetchBrowseData(
  params: {
    category?: string;
    search?: string;
    campusId?: string;
    minPrice?: string;
    maxPrice?: string;
    minRating?: string;
    verifiedOnly?: string;
    sort?: string;
  },
  campusId?: string,
) {
  const query: ListListingsParams = {
    campusId,
    category: params.category,
    search: params.search,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    minRating: params.minRating ? Number(params.minRating) : undefined,
    verifiedOnly: params.verifiedOnly === 'true',
    sort: (params.sort ?? 'newest') as ListListingsParams['sort'],
    limit: 20,
    page: 1,
  };

  const [result, categoriesResult] = await Promise.all([
    listListings(query).catch(() => ({
      listings: [] as ListListingsResult['listings'],
      total: 0,
      page: 1,
      totalPages: 0,
      facets: { categories: [], priceRange: { min: 0, max: 100000 } },
    })),
    getCategories().catch(() => ({ categories: [] })),
  ]);

  const activeFilters = [
    params.search,
    params.category,
    params.campusId,
    params.minPrice,
    params.maxPrice,
    params.minRating,
    params.verifiedOnly,
  ].filter(Boolean).length;

  return { result, categories: categoriesResult.categories, activeFilters };
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const params = await searchParams;
  const me = await getMe().catch(() => null);
  const campusId = params.campusId ?? me?.user?.defaultCampusId ?? undefined;

  const { result, categories, activeFilters } = await fetchBrowseData(params, campusId);

  const header = !campusId ? (
    <>
      <VendorPageHeader
        title="Browse vendors"
        subtitle="Showing vendors across all campuses. Pick your campus for a tailored view."
      />
      <VendorSection>
        <Container size="md">
          <div className="mb-4 rounded-xl border border-gold-500/30 bg-gold-500/5 px-4 py-3 text-sm text-forest-900 dark:text-cream-100">
            Tip: select your campus from the menu to see vendors near you.
          </div>
        </Container>
      </VendorSection>
    </>
  ) : (
    <VendorPageHeader title="Browse vendors" subtitle="Find verified vendors on your campus." />
  );

  return (
    <>
      {header}
      <BrowseClient
        listings={result.listings}
        categories={categories}
        total={result.total}
        activeFilters={activeFilters}
      />
    </>
  );
}
