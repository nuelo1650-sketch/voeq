import { type Metadata } from 'next';
import { getMe } from '@/lib/auth-client';
import { listListings } from '@/lib/marketplace-client';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SearchInput } from '@/components/ui/SearchInput';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { CampusContextBar } from '@/components/marketplace/CampusContextBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { NoVendors } from '@/components/illustrations';
import { Button } from '@/components/ui/Button';
import { ArrowRightIcon, SearchIcon } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Find verified vendors on your campus. Browse food, tech, fashion, and 20+ categories.',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const me = await getMe().catch(() => null);

  if (!me?.user.defaultCampusId) {
    return (
      <Container size="lg">
        <div className="py-16 text-center">
          <p className="text-sm text-forest-700/70">Please select a campus to continue.</p>
        </div>
      </Container>
    );
  }

  const campusId = me.user.defaultCampusId;
  const campusName = me.user.defaultCampus?.name ?? 'your campus';
  const institutionName = me.user.defaultCampus?.institution.name ?? '';

  const recentResult = await listListings({ campusId, sort: 'newest', limit: 12 }).catch(() => null);
  const featuredResult = await listListings({ campusId, sort: 'newest', limit: 6 }).catch(() => null);

  const recentListings = recentResult?.listings ?? [];
  const featuredListings = featuredResult?.listings.slice(0, 6) ?? [];

  const greeting = getGreeting();
  const firstName = me.user.name?.split(' ')[0] ?? 'there';

  return (
    <>
      <CampusContextBar
        campusId={campusId}
        campusName={campusName}
        institutionName={institutionName}
      />

      <Section spacing="md">
        <Container size="lg">
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100 sm:text-4xl">
              {greeting}, {firstName}
            </h1>
            <p className="mt-2 text-base text-forest-700/70 dark:text-cream-100/70">
              Find vendors on your campus
            </p>
          </div>

          <SearchInput
            size="lg"
            placeholder="Search vendors, services, or categories"
            className="w-full"
          />
        </Container>
      </Section>

      {recentListings.length > 0 ? (
        <Section spacing="md">
          <Container size="lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">
                Recently joined
              </h2>
              <a
                href="/browse"
                className="flex items-center gap-1 text-sm font-medium text-forest-700 hover:underline dark:text-gold-500"
              >
                View all <ArrowRightIcon className="h-4 w-4" />
              </a>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {recentListings.slice(0, 8).map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </Container>
        </Section>
      ) : (
        <Section spacing="md">
          <Container size="md">
            <EmptyState
              illustration={<NoVendors className="h-40 w-40 text-forest-700/40 dark:text-cream-100/40" />}
              title="No vendors on your campus yet"
              description="Be the first to know when vendors join. Check back soon or request a vendor."
              action={{ label: 'Request a vendor', onClick: () => { window.location.href = '/request'; } }}
            />
          </Container>
        </Section>
      )}

      {featuredListings.length > 0 && (
        <Section spacing="md" className="bg-cream-50 dark:bg-forest-800">
          <Container size="lg">
            <h2 className="mb-4 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">
              Popular near you
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-3">
              {featuredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section spacing="md">
        <Container size="md">
          <div className="rounded-2xl border border-cream-300 bg-cream-50 p-6 dark:border-forest-700 dark:bg-forest-800">
            <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">
              Run a business on campus?
            </h2>
            <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">
              List your business and start receiving orders directly from students.
            </p>
            <div className="mt-3">
              <Button variant="outline" fullWidth asChild>
                <a href="/become-vendor">List your business</a>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="md">
        <Container size="md">
          <div className="rounded-2xl border border-cream-300 bg-cream-50 p-6 dark:border-forest-700 dark:bg-forest-800">
            <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">
              Can&apos;t find what you need?
            </h2>
            <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">
              Tell us what you&apos;re looking for and we&apos;ll notify relevant vendors or recruit one for your campus.
            </p>
            <div className="mt-4">
              <Button variant="primary" leftIcon={<SearchIcon className="h-4 w-4" />}>
                <a href="/request">Request a vendor</a>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="md">
        <Container size="md">
          <div className="rounded-2xl border border-cream-300 bg-cream-50 p-6 dark:border-forest-700 dark:bg-forest-800">
            <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">
              Run a business on campus?
            </h2>
            <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">
              List your business and start receiving orders directly from students.
            </p>
            <div className="mt-3">
              <Button variant="outline" fullWidth asChild>
                <a href="/become-vendor">List your business</a>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}
