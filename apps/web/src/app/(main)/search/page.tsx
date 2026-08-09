import { type Metadata } from 'next';
import { search } from '@/lib/marketplace-client';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { VendorCard } from '@/components/marketplace/VendorCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { EmptySearch } from '@/components/illustrations';
import { CampusContextBar } from '@/components/marketplace/CampusContextBar';
import { getMe } from '@/lib/auth-client';
import { VendorPageHeader, VendorSection } from '@/components/vendor/VendorPageShell';
import { AnimatedSection } from '@/components/landing/AnimatedSection';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search vendors, services, and categories on Voeq.',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? '';
  const page = Number(params.page) || 1;

  const me = await getMe().catch(() => null);
  const campusId = me?.user.defaultCampusId;
  const campusName = me?.user.defaultCampus?.name ?? '';
  const institutionName = me?.user.defaultCampus?.institution.name ?? '';

  if (!campusId || !campusName || !institutionName) {
    return (
      <>
        {campusId && campusName && (
          <CampusContextBar
            campusId={campusId}
            campusName={campusName}
            institutionName={institutionName}
          />
        )}
        <VendorPageHeader title="Search" subtitle="Find vendors, services, or categories on Voeq." />
        <VendorSection>
          <Container size="md">
            <AnimatedSection>
              <EmptyState
                illustration={<EmptySearch className="h-40 w-40 text-forest-700/40 dark:text-cream-100/40" />}
                title="Search for vendors"
                description="Use the search bar to find vendors, services, or categories on your campus."
              />
            </AnimatedSection>
          </Container>
        </VendorSection>
      </>
    );
  }

  const results = await search({ q: query, campusId, page }).catch(() => null);

  if (!results || (results.totalListings === 0 && results.totalVendors === 0)) {
    return (
      <>
        {campusId && (
          <CampusContextBar
            campusId={campusId}
            campusName={campusName}
            institutionName={institutionName}
          />
        )}
        <VendorPageHeader title={`No results for "${query}"`} subtitle="Try different keywords or browse all categories." />
        <VendorSection>
          <Container size="md">
            <AnimatedSection>
              <EmptyState
                illustration={<EmptySearch className="h-40 w-40 text-forest-700/40 dark:text-cream-100/40" />}
                title={`No results for "${query}"`}
                description="Try different keywords or browse all categories."
              />
            </AnimatedSection>
          </Container>
        </VendorSection>
      </>
    );
  }

  return (
    <>
      {campusId && (
        <CampusContextBar
          campusId={campusId}
          campusName={campusName}
          institutionName={institutionName}
        />
      )}

      <VendorPageHeader
        title={`Results for "${query}"`}
        subtitle={`${results.totalListings + results.totalVendors} ${results.totalListings + results.totalVendors === 1 ? 'result' : 'results'}`}
      />

      {results.listings.length > 0 && (
        <VendorSection title="Listings">
          <Container size="lg">
            <AnimatedSection>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                {results.listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            </AnimatedSection>
          </Container>
        </VendorSection>
      )}

      {results.vendors.length > 0 && (
        <VendorSection title="Vendors" className="bg-cream-50 dark:bg-forest-800">
          <Container size="lg">
            <AnimatedSection>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                {results.vendors.map((vendor) => (
                  <VendorCard
                    key={vendor.id}
                    vendor={{
                      id: vendor.id,
                      slug: vendor.slug,
                      businessName: vendor.businessName,
                      description: vendor.description,
                      photoUrl: vendor.photoUrl,
                      campusName: vendor.campusName,
                      ratingAvg: vendor.ratingAvg,
                      ratingCount: vendor.ratingCount,
                    }}
                  />
                ))}
              </div>
            </AnimatedSection>
          </Container>
        </VendorSection>
      )}
    </>
  );
}
