import { Metadata } from 'next';
import Link from 'next/link';
import { getCategories, listListings, getStats, getInstitutions } from '@/lib/marketplace-client';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SearchInput } from '@/components/ui/SearchInput';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/marketplace/ThemeToggle';
import {
  FoodIcon,
  TechIcon,
  FashionIcon,
  LaundryIcon,
  BeautyIcon,
  RepairsIcon,
  PhotographyIcon,
  AcademicIcon,
  LogisticsIcon,
  FurnitureIcon,
  HealthIcon,
  ArrowRightIcon,
  CheckIcon,
  StarIcon,
  WhatsAppIcon,
  MapIcon,
} from '@/components/icons';
import { AnimatedSection } from '@/components/landing/AnimatedSection';
import { AnnouncementBar } from '@/components/landing/AnnouncementBar';
import Image from 'next/image';
import { buildMetadata, buildOrganizationJsonLd, buildWebSiteJsonLd, buildFaqJsonLd } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Voeq — Find. Connect. Grow.',
  description: 'Discover verified campus vendors on Voeq. Reach every student on campus, free to start with no upfront cost. Built for Nigerian students.',
  path: '/',
  keywords: [
    'campus vendors Nigeria',
    'student marketplace',
    'UNILAG vendors',
    'food near campus',
    'tech repair campus',
    'tailoring campus',
    'verified vendors',
    'WhatsApp marketplace',
    'university vendors',
  ],
});

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  food: FoodIcon,
  fashion: FashionIcon,
  tech: TechIcon,
  laundry: LaundryIcon,
  beauty: BeautyIcon,
  repairs: RepairsIcon,
  photography: PhotographyIcon,
  academic: AcademicIcon,
  logistics: LogisticsIcon,
  furniture: FurnitureIcon,
  health: HealthIcon,
};

const FALLBACK_CATEGORY_IMAGES: Record<string, string> = {
  food: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
  fashion: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
  tech: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
  laundry: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
  beauty: 'linear-gradient(135deg, #fae8ff 0%, #f5d0fe 100%)',
  repairs: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
  photography: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
  'academic-services': 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
  logistics: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)',
  furniture: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
  'health-wellness': 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
  catering: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
  cleaning: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
  electrical: 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)',
  plumbing: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
  tailoring: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
  supermarket: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
  pharmacy: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)',
};

const CATEGORY_IMAGES = FALLBACK_CATEGORY_IMAGES;

const FAQS = [
  { question: 'Is Voeq free to use?', answer: 'Yes, Voeq is completely free for students. You can browse vendors, save listings, and connect via WhatsApp at no cost.' },
  { question: 'How do I contact a vendor?', answer: 'Every vendor profile has a "Chat on WhatsApp" button. Click it to start a conversation directly with the vendor.' },
  { question: 'Are vendors verified?', answer: 'Yes. Vendors go through a verification process including campus presence confirmation and profile review.' },
  { question: 'Which campuses are supported?', answer: 'Voeq launches university by university across Nigeria. Check the homepage for the latest campuses we have gone live at, and if your institution is not listed yet, you can submit it and we will prioritise adding it.' },
  { question: 'Can I become a vendor?', answer: 'Absolutely. Sign up as a vendor, complete your business profile, add your first listing, and start receiving messages from students immediately.' },
  { question: 'How does payment work?', answer: 'In Phase 1 (current), all transactions happen directly between you and the vendor via WhatsApp. In Phase 2, Voeq will integrate secure payments with buyer protection.' },
];

const CAMPUSES = ['NMU', 'UNILAG', 'UI', 'OAU', 'UNIBEN', 'UNIPORT', 'UNICAL', 'UNILORIN', 'FUTMINNA', 'FUTO'];

const STATS_BASE = [
  { key: 'institutions', label: 'Universities' },
  { key: 'categories', label: 'Categories' },
  { key: 'vendors', label: 'Verified vendors' },
  { key: 'listings', label: 'Active listings' },
];

export default async function LandingPage() {
  const [categoriesResult, recentListingsResult, popularListingsResult, statsResult, institutionsResult] = await Promise.all([
    getCategories().catch(() => ({ categories: [] })),
    listListings({ sort: 'newest', limit: 12 }).catch(() => ({ listings: [], total: 0, page: 1, totalPages: 1 })),
    listListings({ sort: 'newest', limit: 6 }).catch(() => ({ listings: [], total: 0, page: 1, totalPages: 1 })),
    getStats().catch(() => ({ institutions: 0, categories: 0, vendors: 0, listings: 0 })),
    getInstitutions().catch(() => ({ institutions: [] })),
  ]);

  const categories = categoriesResult.categories ?? [];
  const recentListings = recentListingsResult.listings ?? [];
  const popularListings = popularListingsResult.listings ?? [];
  const stats = statsResult;

  const STATS = STATS_BASE.map((s) => ({
    number: String(stats[s.key as keyof typeof stats] ?? 0),
    label: s.label,
  }));

  const universityCount = stats.institutions;

  const launchMessages = (institutionsResult.institutions ?? [])
    .slice(0, 8)
    .map((inst) => `🎉 Voeq is live at ${inst.name} — find vendors now`);

  const orgJsonLd = buildOrganizationJsonLd();
  const websiteJsonLd = buildWebSiteJsonLd();
  const faqJsonLd = buildFaqJsonLd(FAQS);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: orgJsonLd }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: websiteJsonLd }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />

      <AnnouncementBar messages={launchMessages} />

      <header className="sticky top-0 z-40 border-b border-cream-200 bg-cream-50/80 backdrop-blur-md dark:border-forest-700 dark:bg-forest-900/80">
        <Container size="lg">
          <div className="flex h-16 items-center justify-between gap-3">
            <Link href="/" className="flex items-center" aria-label="Voeq home">
              <Logo size="xl" />
              <span className="ml-2 text-2xl font-semibold tracking-tight text-forest-900 dark:text-cream-100">Voeq</span>
            </Link>
            <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
              <Link href="/browse" className="text-sm font-medium text-forest-700 hover:text-forest-900 dark:text-cream-100">Browse</Link>
              <Link href="/for-vendors" className="text-sm font-medium text-forest-700 hover:text-forest-900 dark:text-cream-100">For Vendors</Link>
              <Link href="/about" className="text-sm font-medium text-forest-700 hover:text-forest-900 dark:text-cream-100">About</Link>
            </nav>
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <Button variant="ghost" size="sm" asChild>
                <Link href="/signin">Sign in</Link>
              </Button>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <ThemeToggle />
              <Button variant="ghost" size="sm" asChild>
                <Link href="/signin">Sign in</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
              <Button variant="primary" size="sm" asChild>
                <Link href="/become-vendor">List your business</Link>
              </Button>
            </div>
            {/* Mobile menu (native <details>, no JS needed) */}
            <details className="group relative md:hidden">
              <summary className="flex list-none items-center gap-2 rounded-md p-2 text-forest-700 hover:bg-cream-200 dark:text-cream-100 dark:hover:bg-forest-800" aria-label="Open menu">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
              </summary>
              <div className="absolute right-0 z-50 mt-2 w-56 space-y-1 rounded-2xl border border-cream-200 bg-cream-50 p-3 shadow-xl dark:border-forest-700 dark:bg-forest-800">
                <Link href="/browse" className="block rounded-md px-3 py-2 text-sm font-medium text-forest-700 hover:bg-cream-200 dark:text-cream-100 dark:hover:bg-forest-700">Browse</Link>
                <Link href="/for-vendors" className="block rounded-md px-3 py-2 text-sm font-medium text-forest-700 hover:bg-cream-200 dark:text-cream-100 dark:hover:bg-forest-700">For Vendors</Link>
                <Link href="/about" className="block rounded-md px-3 py-2 text-sm font-medium text-forest-700 hover:bg-cream-200 dark:text-cream-100 dark:hover:bg-forest-700">About</Link>
                <div className="my-2 border-t border-cream-200 dark:border-forest-700" />
                <Link href="/signin" className="block rounded-md bg-forest-700 px-3 py-2 text-center text-sm font-medium text-cream-100 hover:bg-forest-800">Sign in</Link>
                <Link href="/signup" className="block rounded-md border border-forest-700 px-3 py-2 text-center text-sm font-medium text-forest-700 hover:bg-cream-200 dark:text-cream-100 dark:hover:bg-forest-700">Sign up</Link>
                <Link href="/become-vendor" className="block rounded-md px-3 py-2 text-center text-sm font-medium text-gold-700 hover:bg-cream-200 dark:text-gold-400 dark:hover:bg-forest-700">List your business</Link>
              </div>
            </details>
          </div>
        </Container>
      </header>

      <main>
        <Section spacing="xl" className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-forest-700/5 via-transparent to-gold-500/10 dark:from-forest-900/40" />
          <Container size="lg">
            <AnimatedSection>
              <div className="mx-auto max-w-3xl text-center">
                <Badge variant="gold" className="mb-6">Find. Connect. Grow.</Badge>
                <h1 className="font-serif text-4xl font-semibold tracking-tight text-forest-900 dark:text-cream-100 sm:text-5xl lg:text-6xl text-balance">
                  Discover verified campus vendors
                </h1>
                <p className="mt-6 text-lg text-forest-700/80 dark:text-cream-100/80 sm:text-xl text-pretty">
                  Reach every student on campus. Free to start, no upfront cost.
                </p>
                <div className="mt-10">
                  <SearchInput size="lg" placeholder="Search vendors, services, or categories" className="mx-auto max-w-2xl" />
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  <span className="text-sm text-forest-700/60 dark:text-cream-100/60">Popular:</span>
                  {categories.slice(0, 4).map((cat) => {
                    const Icon = CATEGORY_ICONS[cat.slug];
                    return (
                      <Link key={cat.id} href={`/browse?category=${cat.slug}`}>
                        <Badge variant="outline" className="cursor-pointer hover:bg-forest-700/5">
                          {Icon && <Icon className="h-3 w-3 mr-1" />}
                          {cat.name}
                        </Badge>
                      </Link>
                    );
                  })}
                </div>
                <p className="mt-12 text-sm text-forest-700/60 dark:text-cream-100/60">
                  Used by students at <span className="font-semibold text-forest-900 dark:text-cream-100">{universityCount}+ Nigerian universities</span>
                </p>
              </div>
            </AnimatedSection>
          </Container>
        </Section>

        <Section spacing="md" className="border-y border-cream-200 bg-cream-50 dark:border-forest-700 dark:bg-forest-800">
          <Container size="lg">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100 sm:text-4xl">{stat.number}</div>
                  <div className="mt-1 text-sm text-forest-700/70 dark:text-cream-100/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {recentListings.length > 0 && (
          <Section spacing="lg">
            <Container size="lg">
              <AnimatedSection>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">Recently joined</h2>
                    <p className="mt-1 text-sm text-forest-700/70 dark:text-cream-100/70">New vendors and listings on Voeq</p>
                  </div>
                  <Link href="/browse?sort=newest" className="text-sm font-medium text-forest-700 hover:underline dark:text-gold-500">
                    View all →
                  </Link>
                </div>
              </AnimatedSection>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                {recentListings.slice(0, 8).map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            </Container>
          </Section>
        )}

        <Section spacing="lg" className="bg-cream-50 dark:bg-forest-800">
          <Container size="lg">
            <AnimatedSection>
              <div className="mb-6">
                <h2 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">Browse by category</h2>
                <p className="mt-1 text-sm text-forest-700/70 dark:text-cream-100/70">Find what you need, fast</p>
              </div>
            </AnimatedSection>
            <div className="-mx-6 mb-8 border-b border-gold-500/15 px-6 pb-4 dark:border-gold-500/10">
              <div className="flex gap-2 overflow-x-auto">
                <Link href="/browse">
                  <Badge variant="default" className="cursor-pointer px-4 py-2 text-sm">All</Badge>
                </Link>
                {categories.map((cat) => {
                  const Icon = CATEGORY_ICONS[cat.slug];
                  return (
                    <Link key={cat.id} href={`/browse?category=${cat.slug}`}>
                      <Badge variant="outline" className="cursor-pointer px-4 py-2 text-sm hover:bg-forest-700/5">
                        {Icon && <Icon className="h-4 w-4 mr-1.5" />}
                        {cat.name}
                      </Badge>
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {categories.slice(0, 6).map((cat) => {
                const Icon = CATEGORY_ICONS[cat.slug];
                const rawImage = CATEGORY_IMAGES[cat.slug] ?? '/Logo.png';
                const isGradient = rawImage.startsWith('linear-gradient');
                return (
                  <Link
                    key={cat.id}
                    href={`/browse?category=${cat.slug}`}
                    className="group flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-cream-300 bg-cream-50 transition hover:border-gold-500/50 hover:shadow-md dark:border-forest-700 dark:bg-forest-900"
                  >
                    <div className="relative h-32 w-full overflow-hidden sm:h-40">
                      {isGradient ? (
                        <div
                          className="h-full w-full"
                          style={{ background: rawImage }}
                        />
                      ) : (
                        <Image
                          src={rawImage}
                          alt={cat.name}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="(min-width: 640px) 200px, 50vw"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                    <div className="flex items-center gap-2 p-4">
                      {Icon && <Icon className="h-5 w-5 text-forest-700 dark:text-cream-100" />}
                      <span className="text-sm font-medium text-forest-900 dark:text-cream-100">{cat.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="mt-8 text-center">
              <Link href="/browse">
                <Button variant="outline" rightIcon={<ArrowRightIcon className="h-4 w-4" />}>View all categories</Button>
              </Link>
            </div>
          </Container>
        </Section>

        {popularListings.length > 0 && (
          <Section spacing="lg">
            <Container size="lg">
              <AnimatedSection>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">Popular on Voeq</h2>
                    <p className="mt-1 text-sm text-forest-700/70 dark:text-cream-100/70">Hand-picked by our team</p>
                  </div>
                  <Link href="/browse" className="text-sm font-medium text-forest-700 hover:underline dark:text-gold-500">
                    View all →
                  </Link>
                </div>
              </AnimatedSection>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                {popularListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            </Container>
          </Section>
        )}



        <Section spacing="lg">
          <Container size="lg">
            <AnimatedSection>
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100 sm:text-4xl">How it works</h2>
                <p className="mt-4 text-lg text-forest-700/70 dark:text-cream-100/70">Three steps from search to chat</p>
              </div>
            </AnimatedSection>
            <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
              {[
                { step: '1', title: 'Pick your campus', description: 'Tell us where you are. We show you vendors from your campus first.' },
                { step: '2', title: 'Browse verified vendors', description: 'See ratings, reviews, and listings from vendors on your campus.' },
                { step: '3', title: 'Chat on WhatsApp', description: 'One tap to message the vendor directly. No middleman, no fees.' },
              ].map((item) => (
                <AnimatedSection key={item.step} delay={Number(item.step) * 0.1}>
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-forest-700 text-xl font-semibold text-cream-100">{item.step}</div>
                    <h3 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">{item.title}</h3>
                    <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">{item.description}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </Container>
        </Section>

        <Section spacing="md" className="bg-cream-50 dark:bg-forest-800">
          <Container size="lg">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              {[
                { title: 'Verified campus vendors', description: 'Every vendor is confirmed to be physically present on the campus they claim. No scams, no fake profiles.' },
                { title: 'Direct WhatsApp connect', description: 'No middleman, no platform fees. Message vendors directly and arrange everything on your terms.' },
                { title: 'Built for students', description: 'Designed by Nigerian students who understand campus life. Fast, simple, and mobile-first.' },
              ].map((item) => (
                <AnimatedSection key={item.title}>
                  <div>
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/20">
                      <CheckIcon className="h-5 w-5 text-gold-700" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">{item.title}</h3>
                    <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">{item.description}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </Container>
        </Section>

        <Section spacing="lg" className="bg-forest-900 text-cream-100">
          <Container size="lg">
            <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
              <AnimatedSection>
                <div>
                  <h2 className="font-serif text-4xl font-semibold sm:text-5xl">Grow your business on campus</h2>
                  <p className="mt-4 text-lg text-cream-100/80">Reach thousands of students on your campus. Free to start, no upfront costs.</p>
                  <ul className="mt-8 space-y-3">
                    {['Reach 10,000+ students', 'Free to start', 'Manage your storefront', 'Direct WhatsApp inquiries'].map((benefit) => (
                      <li key={benefit} className="flex items-center gap-3">
                        <CheckIcon className="h-5 w-5 text-gold-500" />
                        <span className="text-cream-100">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Button variant="gold" size="lg" rightIcon={<ArrowRightIcon className="h-5 w-5" />} asChild>
                      <Link href="/become-vendor">List your business</Link>
                    </Button>
                  </div>
                </div>
              </AnimatedSection>
              <div className="hidden md:flex justify-center">
                <div className="grid grid-cols-2 gap-4">
                  {[FoodIcon, TechIcon, FashionIcon, BeautyIcon].map((Icon, i) => (
                    <div key={i} className="rounded-2xl border border-forest-700 bg-forest-800/50 p-8">
                      <Icon className="h-12 w-12 text-gold-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </Section>

        <Section spacing="lg">
          <Container size="lg">
            <AnimatedSection>
              <div className="text-center">
                <h2 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100 sm:text-4xl">Ready to find what you need on campus?</h2>
                <p className="mt-4 text-base text-forest-700/70 dark:text-cream-100/70">Join thousands of students already using Voeq.</p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button variant="primary" size="lg" asChild>
                    <Link href="/signup">Get started</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/for-vendors">List your business</Link>
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          </Container>
        </Section>

        <Section spacing="lg" className="bg-cream-50 dark:bg-forest-800">
          <Container size="md">
            <AnimatedSection>
              <div className="text-center">
                <h2 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100 sm:text-4xl">Coming soon to campuses near you</h2>
                <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">Launching at NMU, expanding to UNILAG, UI, OAU, and more</p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-forest-700/60 dark:text-cream-100/60">
                  {CAMPUSES.map((campus) => (
                    <span key={campus} className="text-xs font-medium">{campus}</span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </Container>
        </Section>

        <Section spacing="lg" className="border-y border-gold-500/20 bg-cream-50 dark:bg-forest-800">
          <Container size="md">
            <AnimatedSection>
              <h2 className="text-center font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100 sm:text-4xl">Frequently asked questions</h2>
            </AnimatedSection>
            <div className="mt-12 space-y-3">
              {FAQS.map((item) => (
                <details key={item.question} className="group rounded-2xl border border-gold-500/20 bg-cream-50 transition hover:border-gold-500/40 dark:border-forest-700 dark:bg-forest-800 dark:hover:border-gold-500/30">
                  <summary className="cursor-pointer list-none px-6 py-5 text-base font-medium text-forest-900 dark:text-cream-100">
                    <div className="flex items-center justify-between gap-4">
                      <span>{item.question}</span>
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold-500/40 text-gold-700 transition group-open:rotate-180 dark:text-gold-400">
                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </span>
                    </div>
                  </summary>
                  <p className="px-6 pb-5 text-sm leading-relaxed text-forest-700/75 dark:text-cream-100/75">{item.answer}</p>
                </details>
              ))}
            </div>
          </Container>
        </Section>
      </main>

      <footer className="border-t border-cream-200 bg-forest-900 py-12 text-cream-100 dark:border-forest-700">
        <Container size="lg">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" aria-label="Voeq home" className="flex items-center gap-2">
                <Logo size="md" />
                <span className="text-lg font-semibold tracking-tight text-cream-100">Voeq</span>
              </Link>
              <p className="mt-4 text-sm text-cream-100/70">Find. Connect. Grow.</p>
              <p className="mt-2 text-sm text-cream-100/50">The campus marketplace for Nigerian students.</p>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-cream-100">Product</h3>
              <ul className="space-y-2 text-sm text-cream-100/70">
                <li><Link href="/browse" className="hover:text-gold-500">Browse vendors</Link></li>
                <li><Link href="/search" className="hover:text-gold-500">Search</Link></li>
                <li><Link href="/for-vendors" className="hover:text-gold-500">For vendors</Link></li>
                <li><Link href="/wishlist" className="hover:text-gold-500">Wishlist</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-cream-100">Company</h3>
              <ul className="space-y-2 text-sm text-cream-100/70">
                <li><Link href="/about" className="hover:text-gold-500">About</Link></li>
                <li><a href="mailto:hello@voeq.ng" className="hover:text-gold-500">Contact</a></li>
                <li><a href="mailto:support@voeq.ng" className="hover:text-gold-500">Support</a></li>
                <li><Link href="/press" className="hover:text-gold-500">Press</Link></li>
                <li><Link href="/careers" className="hover:text-gold-500">Careers</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-cream-100">Legal</h3>
              <ul className="space-y-2 text-sm text-cream-100/70">
                <li><Link href="/terms" className="hover:text-gold-500">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-gold-500">Privacy Policy</Link></li>
                <li><Link href="/vendor-agreement" className="hover:text-gold-500">Vendor Agreement</Link></li>
                <li><Link href="/cookies" className="hover:text-gold-500">Cookie Policy</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-cream-100">Social</h3>
              <ul className="space-y-2 text-sm text-cream-100/70">
                <li>
                  <a href="https://instagram.com/voeq.ng" target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 hover:text-gold-500">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.259.014-3.667.072-4.947.196-4.354 2.617-6.78 6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="https://tiktok.com/@voeq.ng" target="_blank" rel="noreferrer noopener" className="hover:text-gold-500">TikTok</a>
                </li>
                <li>
                  <a href="https://twitter.com/voeqng" target="_blank" rel="noreferrer noopener" className="hover:text-gold-500">Twitter / X</a>
                </li>
                <li>
                  <a href="https://linkedin.com/company/voeq" target="_blank" rel="noreferrer noopener" className="hover:text-gold-500">LinkedIn</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 border-t border-forest-700 pt-6">
            <span className="text-xs uppercase tracking-widest text-cream-100/50">Powered by</span>
            <Link href="https://legacylm.com" target="_blank" rel="noreferrer noopener" className="group inline-flex items-center gap-2 transition hover:opacity-80" aria-label="Legacy LM">
              <span className="font-serif text-base font-semibold tracking-wide text-cream-100">Legacy</span>
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-gold-500 to-gold-600 text-xs font-bold text-forest-900 ring-1 ring-gold-400/30 transition group-hover:ring-gold-400/60">LM</span>
            </Link>
          </div>

          <div className="mt-6 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <p className="text-sm text-cream-100/50">© 2026 Voeq Limited. All rights reserved.</p>
            <p className="text-sm text-cream-100/50">Built for Nigerian students</p>
          </div>
        </Container>
      </footer>
    </>
  );
}
