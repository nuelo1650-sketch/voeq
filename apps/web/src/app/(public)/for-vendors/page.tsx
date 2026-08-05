import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CheckIcon } from '@/components/icons';

export const metadata: Metadata = buildMetadata({
  title: 'For Vendors',
  description: 'List your business on Voeq and reach thousands of students on your campus. Free to start, no upfront costs.',
  path: '/for-vendors',
});

export default function ForVendorsPage() {
  return (
    <>
      <Section spacing="xl">
        <Container size="md">
          <div className="text-center">
            <Badge variant="gold" className="mb-4">For Vendors</Badge>
            <h1 className="font-serif text-5xl font-semibold text-forest-900 dark:text-cream-100 sm:text-6xl">Grow your business on campus</h1>
            <p className="mt-6 text-lg text-forest-700/80 dark:text-cream-100/80">Reach students at 100+ Nigerian universities. Free to start, no upfront costs.</p>
            <div className="mt-8">
              <Button variant="primary" size="lg" asChild>
                <Link href="/signup">List your business</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="lg" className="bg-cream-50 dark:bg-forest-800">
        <Container size="lg">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { title: 'Reach 10,000+ students', description: 'Get discovered by students actively looking for what you offer.' },
              { title: 'Free to start', description: 'No upfront costs. Create your storefront and add listings in minutes.' },
              { title: 'Direct inquiries', description: 'Students message you directly on WhatsApp. No platform fees in Phase 1.' },
              { title: 'Build trust', description: 'Earn badges and reviews that help you stand out to new customers.' },
              { title: 'Manage easily', description: 'Update your listings, hours, and photos from any device.' },
              { title: 'Grow with us', description: 'Phase 2 (Jan 2027) brings payments, analytics, and featured placements.' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-cream-300 bg-cream-50 p-6 dark:border-forest-700 dark:bg-forest-900">
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
