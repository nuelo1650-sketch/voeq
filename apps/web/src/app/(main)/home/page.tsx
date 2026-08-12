import { type Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { serverGetMe as getMe } from '@/lib/auth-server';
import { serverListListings as listListings, serverGetCategories as getCategories } from '@/lib/marketplace-server';
import type { ListingSummary } from '@/lib/marketplace-client';
import { Container } from '@/components/ui/Container';
import { SearchInput } from '@/components/ui/SearchInput';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CampusContextBar } from '@/components/marketplace/CampusContextBar';
import { CategoryPill } from '@/components/marketplace/CategoryPill';
import { ArrowRightIcon, SearchIcon, StarIcon } from '@/components/icons';
import {
  FoodIcon,
  TechIcon,
  FashionIcon,
  LaundryIcon,
  BeautyIcon,
  RepairsIcon,
} from '@/components/icons';
import { VendorPageHeader, VendorSection } from '@/components/vendor/VendorPageShell';
import { AnimatedSection } from '@/components/landing/AnimatedSection';
import { HomeCarousel } from '@/components/landing/HomeCarousel';

export const metadata: Metadata = {
  title: 'Home',
  robots: { index: false, follow: false },
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  food: FoodIcon,
  fashion: FashionIcon,
  tech: TechIcon,
  laundry: LaundryIcon,
  beauty: BeautyIcon,
  repairs: RepairsIcon,
};

export default async function HomePage() {
  const me = await getMe().catch(() => null);

  if (!me?.user) {
    return (
      <>
        <VendorPageHeader title="Welcome to Voeq" subtitle="Discover verified campus vendors and connect via WhatsApp." />
        <VendorSection className="bg-cream-50 dark:bg-forest-800">
          <Container size="lg">
            <div className="text-center">
              <StarIcon className="mx-auto h-12 w-12 text-gold-500" />
              <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">
                Discover verified campus vendors and connect via WhatsApp.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button variant="primary" size="lg" asChild>
                  <Link href="/signup">Get started</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/signin">Sign in</Link>
                </Button>
              </div>
            </div>
          </Container>
        </VendorSection>

        <VendorSection className="border-y border-cream-200 bg-cream-50 dark:border-forest-700 dark:bg-forest-800">
          <Container size="lg">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {[
                { number: '100+', label: 'Universities' },
                { number: '20+', label: 'Categories' },
                { number: 'Free', label: 'For students' },
                { number: 'Direct', label: 'WhatsApp connect' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100 sm:text-4xl">{stat.number}</div>
                  <div className="mt-1 text-sm text-forest-700/70 dark:text-cream-100/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </Container>
        </VendorSection>
      </>
    );
  }

  const user = me.user;
  const campusId = user.defaultCampusId ?? undefined;

  const [recentResult, popularResult, categoriesResult] = await Promise.all([
    listListings({ campusId, sort: 'newest', limit: 8 }).catch(() => ({ listings: [] })),
    listListings({ campusId, sort: 'newest', limit: 6 }).catch(() => ({ listings: [] })),
    getCategories().catch(() => ({ categories: [] })),
  ]);

  const recentListings = recentResult.listings;
  const popularListings = popularResult.listings;
  const categories = categoriesResult.categories;

  const firstName = user.name?.split(' ')[0] ?? 'there';
  const greeting = getGreeting();
  const campusName = user.defaultCampus?.name ?? 'your campus';
  const institutionName = user.defaultCampus?.institution.name ?? '';

  if (!campusId) {
    // No campus selected yet — don't bounce. Show all-campus content with a soft nudge.
    return (
      <>
        <CampusContextBar campusId={undefined} campusName="" institutionName="" />
        <VendorPageHeader
          title={`${greeting}, ${firstName}`}
          subtitle="Pick your campus to see vendors near you."
        />
        <VendorSection className="border-y border-cream-200 bg-cream-50 dark:border-forest-700 dark:bg-forest-800">
          <Container size="md">
            <div className="rounded-xl border border-gold-500/30 bg-gold-500/5 px-4 py-3 text-sm text-forest-900 dark:text-cream-100">
              Tip: select your campus from the menu to tailor vendors and listings to your school.
            </div>
          </Container>
        </VendorSection>
        <HomeBody
          campusId={undefined}
          categories={categories}
          recentListings={recentListings}
          popularListings={popularListings}
          user={user}
          firstName={firstName}
          greeting={greeting}
          campusName=""
          institutionName=""
        />
      </>
    );
  }

  return (
    <HomeBody
      campusId={campusId}
      campusName={campusName}
      institutionName={institutionName}
      greeting={greeting}
      firstName={firstName}
      categories={categories}
      recentListings={recentListings}
      popularListings={popularListings}
      user={user}
    />
  );
}

function HomeBody({
  campusId,
  campusName,
  institutionName,
  greeting,
  firstName,
  categories,
  recentListings,
  popularListings,
  user,
}: {
  campusId: string | undefined;
  campusName: string;
  institutionName: string;
  greeting: string;
  firstName: string;
  categories: { id: string; name: string; slug: string; iconName: string; listingCount: number }[];
  recentListings: ListingSummary[];
  popularListings: ListingSummary[];
  user: { role: string; name?: string | null; defaultCampus?: { name: string; institution: { name: string } } | null };
}) {
  return (
    <>
      <CampusContextBar
        campusId={campusId}
        campusName={campusName}
        institutionName={institutionName}
      />

      <VendorPageHeader
        title={`${greeting}, ${firstName}`}
        subtitle="Find vendors on your campus"
      />

      <VendorSection>
        <Container size="lg">
          <AnimatedSection>
            <SearchInput size="lg" placeholder="Search vendors, services, or categories" className="w-full" />
          </AnimatedSection>
        </Container>
      </VendorSection>

      {categories.length > 0 && (
        <VendorSection title="Browse by category" className="bg-cream-50 dark:bg-forest-800">
          <Container size="lg">
            <AnimatedSection>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">Browse by category</h2>
                <Link href="/browse" className="text-sm font-medium text-forest-700 hover:underline dark:text-gold-500">
                  View all →
                </Link>
              </div>
              <div className="-mx-6 mb-6 overflow-x-auto px-6 pb-2">
                <div className="flex gap-2">
                  <CategoryPill slug="" name="All" iconName="OtherIcon" active href="/browse" />
                  {categories.map((cat) => (
                    <CategoryPill
                      key={cat.id}
                      slug={cat.slug}
                      name={cat.name}
                      iconName={cat.slug}
                      active={false}
                      href={`/browse?category=${cat.slug}`}
                    />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
                {categories.slice(0, 6).map((cat) => {
                  const Icon = categoryIcons[cat.slug];
                  return (
                    <Link
                      key={cat.id}
                      href={`/browse?category=${cat.slug}`}
                      className="group flex flex-col items-center justify-center rounded-2xl border border-cream-300 bg-cream-50 p-4 transition hover:border-forest-700/30 hover:shadow-md dark:border-forest-700 dark:bg-forest-800"
                    >
                      {Icon && <Icon className="h-8 w-8 text-forest-700 transition group-hover:text-forest-900 dark:text-cream-100" />}
                      <span className="mt-2 text-xs font-medium text-forest-900 dark:text-cream-100">{cat.name}</span>
                      <span className="mt-0.5 text-[10px] text-forest-700/60 dark:text-cream-100/60">
                        {cat.listingCount} {cat.listingCount === 1 ? 'vendor' : 'vendors'}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </AnimatedSection>
          </Container>
        </VendorSection>
      )}

      <VendorSection>
        <Container size="lg">
          <HomeCarousel campusId={campusId} />
        </Container>
      </VendorSection>

      {recentListings.length === 0 && popularListings.length === 0 && (
        <VendorSection>
          <Container size="md">
            <AnimatedSection>
              <div className="rounded-2xl border border-cream-300 bg-cream-50 p-8 text-center dark:border-forest-700 dark:bg-forest-800">
                <SearchIcon className="mx-auto h-10 w-10 text-forest-700/40 dark:text-cream-100/40" />
                <h2 className="mt-4 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">No vendors yet</h2>
                <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">
                  Be the first to know when vendors join {campusName}. We&apos;ll notify you when listings go live.
                </p>
                <div className="mt-6">
                  <Button asChild>
                    <Link href="/become-vendor">Request a vendor</Link>
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          </Container>
        </VendorSection>
      )}

      {(user.role === 'buyer') && (
        <VendorSection className="border-y border-cream-200 bg-forest-900 text-cream-100 dark:border-forest-700">
          <Container size="md">
            <AnimatedSection>
              <div className="text-center">
                <h2 className="font-serif text-2xl font-semibold">Have a business on campus?</h2>
                <p className="mt-2 text-sm text-cream-100/70">
                  List your business on Voeq and reach thousands of students at {institutionName || 'your campus'}.
                </p>
                <div className="mt-6">
                  <Button variant="gold" asChild>
                    <Link href="/become-vendor">List your business</Link>
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          </Container>
        </VendorSection>
      )}
    </>
  );
}
