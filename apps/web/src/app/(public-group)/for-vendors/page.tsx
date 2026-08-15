import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { getStats } from '@/lib/marketplace-client';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CheckIcon } from '@/components/icons';
import { AnimatedSection } from '@/components/landing/AnimatedSection';

export const metadata: Metadata = buildMetadata({
  title: 'For Vendors',
  description: 'List your business on Voeq and reach thousands of students on your campus. Free to start, no upfront costs.',
  path: '/for-vendors',
});

export default async function ForVendorsPage() {
  const stats = await getStats().catch(() => ({ institutions: 0, categories: 0, vendors: 0, listings: 0 }));
  const universityCount = stats.institutions ?? 0;

  return (
    <>
      <Section spacing="xl">
        <Container size="md">
          <div className="text-center">
            <Badge variant="gold" className="mb-4">For Vendors</Badge>
            <h1 className="font-serif text-5xl font-semibold text-forest-900 dark:text-cream-100 sm:text-6xl">Grow your business on campus</h1>
            <p className="mt-6 text-lg text-forest-700/80 dark:text-cream-100/80">Live across {universityCount}+ universities and growing.</p>
            <div className="mt-8">
              <Button variant="primary" size="lg" asChild>
                <Link href="/signup">List your business</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* WHO CAN SELL / HOW IT WORKS FOR VENDORS */}
      <Section spacing="md">
        <Container size="lg">
          <AnimatedSection>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100 sm:text-4xl">Who can sell on Voeq?</h2>
              <p className="mt-4 text-lg text-forest-700/80 dark:text-cream-100/80">
                Any vendor serving a campus — food sellers, tailors, tech repairers, laundromats, photographers, printers,
                and more. You keep your business; Voeq just puts your storefront in front of the students who need it.
              </p>
            </div>
          </AnimatedSection>
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { step: '1', title: 'Create your storefront', description: 'Sign up free and add your business details in minutes.' },
              { step: '2', title: 'Add your listings', description: 'Post what you sell with photos and prices — no commission, ever.' },
              { step: '3', title: 'Get discovered', description: 'Students on your campus find you and message you directly on WhatsApp.' },
            ].map((item) => (
              <div key={item.step} className="rounded-2xl border border-cream-300 bg-cream-50 p-6 text-center dark:border-forest-700 dark:bg-forest-900 dark:bg-forest-800 dark:border-cream-100">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-forest-700 text-lg font-semibold text-cream-100">{item.step}</div>
                <h3 className="font-serif text-lg font-semibold text-forest-900 dark:text-cream-100">{item.title}</h3>
                <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="lg" className="bg-cream-50 dark:bg-forest-800">
        <Container size="lg">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { title: `Reach students across ${universityCount}+ universities`, description: 'Get discovered by students actively looking for what you offer.' },
              { title: 'Free to start', description: 'No upfront costs. Create your storefront and add listings in minutes.' },
              { title: 'Direct inquiries', description: 'Students message you directly on WhatsApp. No platform fees in Phase 1.' },
              { title: 'Build trust', description: 'Earn badges and reviews that help you stand out to new customers.' },
              { title: 'Manage easily', description: 'Update your listings, hours, and photos from any device.' },
              { title: 'Grow with us', description: 'Phase 2 (Jan 2027) brings payments, analytics, and featured placements.' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-cream-300 bg-cream-50 p-6 dark:border-forest-700 dark:bg-forest-900 dark:bg-forest-800 dark:border-cream-100">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/20">
                  <CheckIcon className="h-5 w-5 text-gold-700" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">{item.title}</h3>
                <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
