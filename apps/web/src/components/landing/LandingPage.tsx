'use client';

import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SearchInput } from '@/components/ui/SearchInput';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FoodIcon, TechIcon, FashionIcon, LaundryIcon, BeautyIcon, RepairsIcon, ArrowRightIcon, CheckIcon } from '@/components/icons';
import { WhatsAppClick } from '@/components/illustrations';
import Link from 'next/link';

const CATEGORIES = [
  { name: 'Food', slug: 'food', icon: FoodIcon },
  { name: 'Tech', slug: 'tech', icon: TechIcon },
  { name: 'Fashion', slug: 'fashion', icon: FashionIcon },
  { name: 'Laundry', slug: 'laundry', icon: LaundryIcon },
  { name: 'Beauty', slug: 'beauty', icon: BeautyIcon },
  { name: 'Repairs', slug: 'repairs', icon: RepairsIcon },
  { name: 'Books', slug: 'books', icon: TechIcon },
  { name: 'Photography', slug: 'photography', icon: FashionIcon },
  { name: 'Fitness', slug: 'fitness', icon: RepairsIcon },
  { name: 'Events', slug: 'events', icon: BeautyIcon },
  { name: 'Tutoring', slug: 'tutoring', icon: LaundryIcon },
  { name: 'Delivery', slug: 'delivery', icon: FoodIcon },
];

export function LandingPage() {
  return (
    <>
      <Section spacing="xl" className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-forest-700/5 via-transparent to-gold-500/10" />
        <Container size="lg">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="gold" className="mb-6">Find. Connect. Grow.</Badge>
            <h1 className="font-serif text-5xl font-semibold tracking-tight text-forest-900 dark:text-cream-100 sm:text-6xl lg:text-7xl text-balance">
              Discover verified campus vendors
            </h1>
            <p className="mt-6 text-lg text-forest-700/80 dark:text-cream-100/80 sm:text-xl text-pretty">
              Find food, tech, fashion, and 20+ categories of trusted vendors on your campus. Connect directly via WhatsApp.
            </p>
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
            <p className="mt-12 text-sm text-forest-700/60 dark:text-cream-100/60">
              Used by students at <span className="font-semibold text-forest-900 dark:text-cream-100">100+ Nigerian universities</span>
            </p>
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
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link key={cat.slug} href={'/browse?category=' + cat.slug} className="group flex flex-col items-center justify-center rounded-2xl border border-cream-300 bg-cream-50 p-6 transition hover:border-forest-700/30 hover:shadow-md dark:border-forest-700 dark:bg-forest-900 dark:hover:border-cream-100/20">
                  <Icon className="h-10 w-10 text-forest-700 transition group-hover:text-forest-900 dark:text-cream-100" />
                  <span className="mt-3 text-sm font-medium text-forest-900 dark:text-cream-100">{cat.name}</span>
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
                <Link href="/for-vendors">
                  <Button variant="gold" size="lg">List your business</Button>
                </Link>
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
              <Link href="/signup">
                <Button variant="primary" size="lg">Get started</Button>
              </Link>
              <Link href="/for-vendors">
                <Button variant="outline" size="lg">List your business</Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <footer className="border-t border-cream-200 bg-forest-900 py-12 text-cream-100 dark:border-forest-700">
        <Container size="lg">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
            <div>
              <Link href="/" aria-label="Voeq home">
                <span className="font-serif text-lg font-semibold text-cream-100">Voeq</span>
              </Link>
              <p className="mt-4 text-sm text-cream-100/70">Voeq /voʊk/ — like Vogue</p>
              <p className="mt-2 text-sm text-cream-100/70">Built by students, for students.</p>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-cream-100">Product</h3>
              <ul className="space-y-2 text-sm text-cream-100/70">
                <li><Link href="/browse" className="hover:text-gold-500">Browse vendors</Link></li>
                <li><Link href="/search" className="hover:text-gold-500">Search</Link></li>
                <li><Link href="/for-vendors" className="hover:text-gold-500">For vendors</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-cream-100">Company</h3>
              <ul className="space-y-2 text-sm text-cream-100/70">
                <li><Link href="/about" className="hover:text-gold-500">About</Link></li>
                <li><Link href="mailto:hello@voeq.ng" className="hover:text-gold-500">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-cream-100">Legal</h3>
              <ul className="space-y-2 text-sm text-cream-100/70">
                <li><Link href="/terms" className="hover:text-gold-500">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-gold-500">Privacy Policy</Link></li>
                <li><Link href="/vendor-agreement" className="hover:text-gold-500">Vendor Agreement</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-cream-100">Social</h3>
              <ul className="space-y-2 text-sm text-cream-100/70">
                <li><Link href="https://instagram.com/voeq.ng" target="_blank" rel="noreferrer noopener" className="hover:text-gold-500">Instagram</Link></li>
                <li><Link href="https://tiktok.com/@voeq.ng" target="_blank" rel="noreferrer noopener" className="hover:text-gold-500">TikTok</Link></li>
                <li><Link href="https://twitter.com/voeqng" target="_blank" rel="noreferrer noopener" className="hover:text-gold-500">Twitter / X</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-2 border-t border-forest-700 pt-6 sm:flex-row sm:gap-3">
            <span className="text-xs uppercase tracking-widest text-cream-100/50">Powered by</span>
            <Link href="#" target="_blank" rel="noreferrer noopener" className="group inline-flex items-center gap-2 transition hover:opacity-80" aria-label="Legacy LM">
              <span className="font-serif text-base font-semibold tracking-wide text-cream-100">Legacy</span>
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-gold-500 to-gold-600 text-xs font-bold text-forest-900 ring-1 ring-gold-400/30 transition group-hover:ring-gold-400/60">LM</span>
            </Link>
          </div>

          <div className="mt-6 border-t border-forest-700 pt-6">
            <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
              <p className="text-sm text-cream-100/50">© 2026 Voeq Limited. All rights reserved.</p>
              <p className="text-sm text-cream-100/50">Pronounced <span className="font-semibold text-gold-500">/voʊk/</span> — like Vogue</p>
            </div>
          </div>
        </Container>
      </footer>
    </>
  );
}
