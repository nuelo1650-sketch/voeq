import { type Metadata } from 'next';
import { listListings, getCategories } from '@/lib/marketplace-client';
import { getMe } from '@/lib/auth-client';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { CategoryPill } from '@/components/marketplace/CategoryPill';
import { CampusContextBar } from '@/components/marketplace/CampusContextBar';

export const metadata: Metadata = {
  title: 'Browse',
  description: 'Browse all vendors and listings on Voeq. Filter by category and campus.',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

interface BrowsePageProps {
  searchParams: Promise<{ category?: string }>;
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
    listListings({ campusId, category: params.category, limit: 40 }).catch(() => null),
    getCategories().catch(() => null),
  ]);

  const listings = listingsResult?.listings ?? [];
  const categories = categoriesResult?.categories ?? [];
  const activeCategory = params.category;

  return (
    <>
      <CampusContextBar
        campusId={campusId}
        campusName={campusName}
        institutionName={institutionName}
      />

      <Section spacing="md">
        <Container size="lg">
          <h1 className="font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100 sm:text-3xl">
            Browse
          </h1>

          <div className="mt-6 -mx-6 px-6 overflow-x-auto pb-2">
            <div className="flex gap-2">
              <CategoryPill
                slug=""
                name="All"
                iconName="OtherIcon"
                active={!activeCategory}
                href="/browse"
              />
              {categories.map((cat) => (
                <CategoryPill
                  key={cat.slug}
                  slug={cat.slug}
                  name={cat.name}
                  iconName={`${cat.iconName.charAt(0).toUpperCase() + cat.iconName.slice(1)}Icon`}
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
            <p className="py-16 text-center text-sm text-forest-700/60 dark:text-cream-100/60">
              No listings in this category yet.
            </p>
          )}
        </Container>
      </Section>
    </>
  );
}
