import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { AnimatedSection } from '@/components/landing/AnimatedSection';
import { ArrowRightIcon, CheckIcon, StarIcon, WhatsAppIcon, MapIcon } from '@/components/icons';

export const metadata: Metadata = buildMetadata({
  title: 'About',
  description:
    'Voeq (pronounced "voke") is the campus marketplace connecting Nigerian students with verified vendors they can chat with directly on WhatsApp. Find. Connect. Grow.',
  path: '/about',
});

const DIFFERENTIATORS = [
  {
    icon: CheckIcon,
    title: 'Verified campus vendors',
    body: 'Every vendor is confirmed to be physically present on the campus they serve. No scams, no fake profiles.',
  },
  {
    icon: WhatsAppIcon,
    title: 'Direct WhatsApp, no middleman',
    body: 'Message vendors directly and arrange everything on your terms. No platform fees, no commissions.',
  },
  {
    icon: StarIcon,
    title: 'Ratings & reviews',
    body: 'Real feedback from real students, so you always know who you are dealing with before you reach out.',
  },
  {
    icon: MapIcon,
    title: 'Built for Nigerian students',
    body: 'Designed for campus life — fast, simple, and made for the way students actually discover vendors.',
  },
];

const WHO_ITS_FOR = [
  {
    title: "I'm a student",
    body: 'Find verified vendors for food, fashion, tech repairs, laundry and more on your campus. See real ratings, message vendors on WhatsApp, and pay zero platform fees.',
    cta: { label: 'Browse vendors', href: '/browse' },
  },
  {
    title: "I'm a vendor",
    body: 'List free, reach students on your campus, and sell directly over WhatsApp. No commissions, no middleman — your storefront goes live in minutes.',
    cta: { label: 'List your business', href: '/become-vendor' },
  },
];

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <Section spacing="lg" className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-forest-700/5 via-transparent to-gold-500/10 dark:from-forest-900/40" />
        <Container size="md">
          <AnimatedSection>
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-forest-900 dark:text-cream-100 sm:text-5xl lg:text-6xl">
              About Voeq
            </h1>
            <p className="mt-3 text-lg text-forest-700/70 dark:text-cream-100/70">
              Pronounced <span className="font-semibold text-forest-900 dark:text-cream-100">&ldquo;voke&rdquo;</span> — like the sound of a connection being made.
            </p>
            <p className="mt-6 font-serif text-2xl text-gold-600 dark:text-gold-500">Pronounced &quot;Voke&quot;.</p>
            <p className="mt-6 text-lg text-forest-700/80 dark:text-cream-100/80">
              Voeq is the campus marketplace where Nigerian students discover verified vendors and chat with them
              directly on WhatsApp — and where vendors reach every student on their campus for free.
            </p>
          </AnimatedSection>
        </Container>
      </Section>

      {/* MISSION / WHY WE EXIST */}
      <Section spacing="md" className="border-y border-cream-200 bg-cream-50 dark:border-forest-700 dark:bg-forest-800">
        <Container size="md">
          <AnimatedSection>
            <h2 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100 sm:text-4xl">
              Why we exist
            </h2>
            <p className="mt-4 text-lg text-forest-700/80 dark:text-cream-100/80">
              Finding a reliable vendor on campus used to mean word of mouth that only went so far. Voeq closes that
              gap — a single place to search by what you need, see vendors who are verified to be on your campus, and
              connect with them directly. We&apos;re a discovery platform: helping students find the right people, and
              helping vendors get found.
            </p>
          </AnimatedSection>
        </Container>
      </Section>

      {/* WHAT MAKES US DIFFERENT */}
      <Section spacing="lg">
        <Container size="lg">
          <AnimatedSection>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100 sm:text-4xl">
                What makes Voeq different
              </h2>
              <p className="mt-4 text-lg text-forest-700/70 dark:text-cream-100/70">
                We are built around trust and direct connection — not fees and middlemen.
              </p>
            </div>
          </AnimatedSection>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {DIFFERENTIATORS.map((item) => (
              <AnimatedSection key={item.title}>
                <div className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-500/20">
                    <item.icon className="h-5 w-5 text-gold-700" />
                  </span>
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">{item.title}</h3>
                    <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">{item.body}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </Section>

      {/* WHO IT'S FOR */}
      <Section spacing="lg" className="bg-cream-50 dark:bg-forest-800">
        <Container size="lg">
          <AnimatedSection>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100 sm:text-4xl">
                Who it&apos;s for
              </h2>
            </div>
          </AnimatedSection>
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
            {WHO_ITS_FOR.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-cream-300 bg-cream-50 p-7 dark:border-forest-700 dark:bg-forest-900"
              >
                <h3 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">{item.title}</h3>
                <p className="mt-3 text-sm text-forest-700/80 dark:text-cream-100/80">{item.body}</p>
                <Button variant="primary" size="md" className="mt-5" asChild>
                  <Link href={item.cta.href}>
                    {item.cta.label} <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA BAND */}
      <Section spacing="lg">
        <Container size="md">
          <AnimatedSection>
            <div className="rounded-3xl border border-gold-500/30 bg-forest-900 px-8 py-12 text-center text-cream-100">
              <h2 className="font-serif text-3xl font-semibold sm:text-4xl">Ready to find what you need on campus?</h2>
              <p className="mt-4 text-lg text-cream-100/80">
                Join the campus marketplace built for Nigerian students.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button variant="gold" size="lg" asChild>
                  <Link href="/signup">Get started</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-cream-100/40 text-cream-100 hover:bg-cream-100/10"
                  asChild
                >
                  <Link href="/for-vendors">List your business</Link>
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </Section>
    </>
  );
}
