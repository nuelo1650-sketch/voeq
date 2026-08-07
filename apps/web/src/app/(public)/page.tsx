import type { Metadata } from 'next';
import { buildMetadata, buildOrganizationJsonLd, buildWebSiteJsonLd, buildFaqJsonLd } from '@/lib/seo';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SearchInput } from '@/components/ui/SearchInput';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FoodIcon, TechIcon, FashionIcon, LaundryIcon, BeautyIcon, RepairsIcon, ArrowRightIcon, CheckIcon } from '@/components/icons';
import { WhatsAppClick } from '@/components/illustrations';

export const metadata: Metadata = buildMetadata({
  title: 'Voeq — Find. Connect. Grow.',
  description: 'Discover verified campus vendors on Voeq. Browse food, tech, fashion, and 20+ categories. Connect directly via WhatsApp. Built for Nigerian students at 100+ universities.',
  path: '/',
  keywords: ['campus vendors Nigeria', 'student marketplace', 'UNILAG vendors', 'food near campus', 'tech repair campus', 'tailoring campus'],
});

export default function LandingPage() {
  const orgJsonLd = buildOrganizationJsonLd();
  const websiteJsonLd = buildWebSiteJsonLd();
  const faqJsonLd = buildFaqJsonLd([
    { question: 'Is Voeq free to use?', answer: 'Yes, Voeq is completely free for students. You can browse vendors, save listings, and connect via WhatsApp at no cost.' },
    { question: 'How do I contact a vendor?', answer: 'Every vendor profile has a "Chat on WhatsApp" button. Click it to start a conversation directly with the vendor.' },
    { question: 'Are vendors verified?', answer: 'Yes. Vendors go through a verification process including campus presence confirmation, profile review, and ongoing trust scoring.' },
    { question: 'Which campuses are supported?', answer: 'Voeq supports 100+ Nigerian universities. If your institution is not listed, you can submit it and we will add it within 24 hours.' },
    { question: 'Can I become a vendor?', answer: 'Absolutely. Sign up as a vendor, complete your business profile, add your first listing, and you can start receiving messages from students immediately.' },
    { question: 'How does payment work?', answer: 'In Phase 1 (current), all transactions happen directly between you and the vendor via WhatsApp. In Phase 2 (January 2027), Voeq will integrate secure payments with buyer protection.' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: orgJsonLd }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: websiteJsonLd }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />

      <Section spacing="xl" className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-forest-700/5 via-transparent to-gold-500/10" />
        <Container size="lg">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="gold" className="mb-6">Find. Connect. Grow.</Badge>
            <h1 className="font-serif text-5xl font-semibold tracking-tight text-forest-900 dark:text-cream-100 sm:text-6xl lg:text-7xl text-balance">Discover verified campus vendors</h1>
            <p className="mt-6 text-lg text-forest-700/80 dark:text-cream-100/80 sm:text-xl text-pretty">Find food, tech, fashion, and 20+ categories of trusted vendors on your campus. Connect directly via WhatsApp.</p>
            <div className="mt-10">
              <SearchInput size="lg" placeholder="Search vendors, services, or categories" className="mx-auto max-w-2xl" />
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="text-sm text-forest-700/60 dark:text-cream-100/60">Popular:</span>
              {['Food', 'Tech', 'Fashion', 'Laundry'].map((cat) => (
                <a key={cat} href={'/browse?category=' + cat.toLowerCase()} className="inline-block">
                  <Badge variant="outline" className="cursor-pointer hover:bg-forest-700/5">{cat}</Badge>
                </a>
              ))}
            </div>
            <p className="mt-12 text-sm text-forest-700/60 dark:text-cream-100/60">Used by students at <span className="font-semibold text-forest-900 dark:text-cream-100">100+ Nigerian universities</span></p>
          </div>
        </Container>
      </Section>

      <Section spacing="md" className="border-y border-cream-200 bg-cream-50 dark:border-forest-700 dark:bg-forest-800">
        <Container size="lg">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
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
      </Section>

      <Section spacing="lg">
        <Container size="lg">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-4xl font-semibold text-forest-900 dark:text-cream-100 sm:text-5xl">How it works</h2>
            <p className="mt-4 text-lg text-forest-700/70 dark:text-cream-100/70">Three steps from search to chat</p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
            {[
              { step: '1', title: 'Pick your campus', description: 'Tell us where you are. We show you vendors from your campus first.' },
              { step: '2', title: 'Browse verified vendors', description: 'See ratings, reviews, and listings from vendors on your campus.' },
              { step: '3', title: 'Chat on WhatsApp', description: 'One tap to message the vendor directly. No middleman, no fees.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-forest-700 text-xl font-semibold text-cream-100">{item.step}</div>
                <h3 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">{item.title}</h3>
                <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="lg" className="bg-cream-50 dark:bg-forest-800">
        <Container size="lg">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-4xl font-semibold text-forest-900 dark:text-cream-100 sm:text-5xl">Browse by category</h2>
            <p className="mt-4 text-lg text-forest-700/70 dark:text-cream-100/70">Find what you need, fast</p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { name: 'Food', slug: 'food', icon: FoodIcon },
              { name: 'Tech', slug: 'tech', icon: TechIcon },
              { name: 'Fashion', slug: 'fashion', icon: FashionIcon },
              { name: 'Laundry', slug: 'laundry', icon: LaundryIcon },
              { name: 'Beauty', slug: 'beauty', icon: BeautyIcon },
              { name: 'Repairs', slug: 'repairs', icon: RepairsIcon },
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <a key={cat.slug} href={'/browse?category=' + cat.slug} className="group flex flex-col items-center justify-center rounded-2xl border border-cream-300 bg-cream-50 p-6 transition hover:border-forest-700/30 hover:shadow-md dark:border-forest-700 dark:bg-forest-900 dark:hover:border-cream-100/20">
                  <Icon className="h-10 w-10 text-forest-700 transition group-hover:text-forest-900 dark:text-cream-100" />
                  <span className="mt-3 text-sm font-medium text-forest-900 dark:text-cream-100">{cat.name}</span>
                </a>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <a href="/browse">
              <Button variant="outline" rightIcon={<ArrowRightIcon className="h-4 w-4" />}>View all categories</Button>
            </a>
          </div>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container size="lg">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {[
              { title: 'Verified campus vendors', description: 'Every vendor is confirmed to be physically present on the campus they claim. No scams, no fake profiles.' },
              { title: 'Direct WhatsApp connect', description: 'No middleman, no platform fees. Message vendors directly and arrange everything on your terms.' },
              { title: 'Built for students', description: 'Designed by Nigerian students who understand the campus life. Fast, simple, and mobile-first.' },
            ].map((item) => (
              <div key={item.title}>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/20">
                  <CheckIcon className="h-5 w-5 text-gold-700" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">{item.title}</h3>
                <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="lg" className="bg-forest-900 text-cream-100">
        <Container size="lg">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
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
                <a href="/for-vendors">
                  <Button variant="gold" size="lg">List your business</Button>
                </a>
              </div>
            </div>
            <div className="flex justify-center">
              <WhatsAppClick className="h-64 w-64 text-gold-500" />
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container size="md">
          <div className="text-center">
            <h2 className="font-serif text-4xl font-semibold text-forest-900 dark:text-cream-100 sm:text-5xl">Frequently asked questions</h2>
          </div>
          <div className="mt-12 space-y-4">
            {[
              { q: 'Is Voeq free to use?', a: 'Yes, Voeq is completely free for students. You can browse vendors, save listings, and connect via WhatsApp at no cost.' },
              { q: 'How do I contact a vendor?', a: 'Every vendor profile has a "Chat on WhatsApp" button. Click it to start a conversation directly with the vendor.' },
              { q: 'Are vendors verified?', a: 'Yes. Vendors go through a verification process including campus presence confirmation and profile review.' },
              { q: 'Which campuses are supported?', a: 'Voeq supports 100+ Nigerian universities. If your institution is not listed, you can submit it and we will add it.' },
              { q: 'Can I become a vendor?', a: 'Absolutely. Sign up as a vendor, complete your business profile, add your first listing, and start receiving messages immediately.' },
            ].map((item) => (
              <details key={item.q} className="group rounded-2xl border border-cream-300 bg-cream-50 p-6 dark:border-forest-700 dark:bg-forest-800">
                <summary className="cursor-pointer text-base font-medium text-forest-900 dark:text-cream-100">{item.q}</summary>
                <p className="mt-3 text-sm text-forest-700/70 dark:text-cream-100/70">{item.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="lg" className="bg-cream-50 dark:bg-forest-800">
        <Container size="md">
          <div className="text-center">
            <h2 className="font-serif text-4xl font-semibold text-forest-900 dark:text-cream-100 sm:text-5xl">Ready to find what you need on campus?</h2>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="/signup">
                <Button variant="primary" size="lg">Get started</Button>
              </a>
              <a href="/for-vendors">
                <Button variant="outline" size="lg">List your business</Button>
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
