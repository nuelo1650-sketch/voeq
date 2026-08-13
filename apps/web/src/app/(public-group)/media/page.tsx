import { type Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Media',
  description: 'Brand assets, logos, and media enquiries for Voeq.',
  robots: { index: true, follow: true },
};

export default function MediaPage() {
  return (
    <Section spacing="lg">
      <Container size="md">
        <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100 sm:text-4xl">Media & brand</h1>
        <p className="mt-3 text-base text-forest-700/80 dark:text-cream-100/80">
          Logos, screenshots, and brand guidelines for press and partners.
        </p>

        <div className="mt-10 space-y-6">
          <article className="rounded-2xl border border-cream-300 bg-cream-50 p-6 dark:border-forest-700 dark:bg-forest-800">
            <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Brand assets</h2>
            <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">
              Download the Voeq logo and favicon for editorial use.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="outline" asChild>
                <a href="/Name.png" download>Logo (PNG)</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/favicon-192.png" download>Favicon (PNG)</a>
              </Button>
            </div>
          </article>

          <article className="rounded-2xl border border-cream-300 bg-cream-50 p-6 dark:border-forest-700 dark:bg-forest-800">
            <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Media kit</h2>
            <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">
              For logos, high-resolution screenshots, or interview requests, reach our press team.
            </p>
            <div className="mt-4">
              <Button variant="outline" asChild>
                <Link href="mailto:press@voeq.ng">Email press@voeq.ng</Link>
              </Button>
            </div>
          </article>

          <article className="rounded-2xl border border-cream-300 bg-cream-50 p-6 dark:border-forest-700 dark:bg-forest-800">
            <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Latest news</h2>
            <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">
              Read the latest announcements on our press page.
            </p>
            <div className="mt-4">
              <Button variant="outline" asChild>
                <Link href="/press">View press room</Link>
              </Button>
            </div>
          </article>
        </div>
      </Container>
    </Section>
  );
}
