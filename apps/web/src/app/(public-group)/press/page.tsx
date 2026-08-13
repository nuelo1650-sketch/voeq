import { type Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { serverGetPressItems } from '@/lib/marketplace-server';

export const metadata: Metadata = {
  title: 'Press',
  description: 'Stories, announcements, and brand assets for press and partners.',
  robots: { index: true, follow: true },
};

const KIND_LABELS: Record<string, string> = {
  announcement: 'Announcement',
  feature: 'Feature',
  'press-release': 'Press release',
  blog: 'Blog',
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-NG', { year: 'numeric', month: 'long' });
  } catch {
    return '';
  }
}

export default async function PressPage() {
  const { items } = await serverGetPressItems().catch(() => ({ items: [] as Awaited<ReturnType<typeof serverGetPressItems>>['items'] }));

  return (
    <Section spacing="lg">
      <Container size="md">
        <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100 sm:text-4xl">Press & media</h1>
        <p className="mt-3 text-base text-forest-700/80 dark:text-cream-100/80">
          Stories, announcements, and brand assets for press and partners.
        </p>

        <div className="mt-10 space-y-6">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-cream-300 bg-cream-50 p-8 text-center dark:border-forest-700 dark:bg-forest-800">
              <p className="text-sm text-forest-700/70 dark:text-cream-100/70">
                No announcements yet. Check back soon for the latest Voeq news.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-cream-300 bg-cream-50 p-6 dark:border-forest-700 dark:bg-forest-800"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-gold-700">
                  {KIND_LABELS[item.kind] ?? item.kind}
                </p>
                <h2 className="mt-2 font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">{item.title}</h2>
                {item.summary && (
                  <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">{item.summary}</p>
                )}
                <p className="mt-3 text-xs text-forest-700/60 dark:text-cream-100/60">{formatDate(item.publishDate)}</p>
              </article>
            ))
          )}
        </div>

        <div className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Media kit</h2>
          <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">
            Logos, screenshots, and brand guidelines for press use.
          </p>
          <div className="mt-4">
            <Button variant="outline" asChild>
              <Link href="/media">View brand assets</Link>
            </Button>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Contact</h2>
          <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">
            For interviews or partnership requests, email{' '}
            <a href="mailto:press@voeq.ng" className="font-medium text-gold-700 hover:underline dark:text-gold-400">
              press@voeq.ng
            </a>
            .
          </p>
        </div>
      </Container>
    </Section>
  );
}
