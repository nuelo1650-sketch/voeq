import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';

export const metadata: Metadata = buildMetadata({
  title: 'About',
  description: 'Voeq is a marketplace directory connecting people with trusted vendors and service providers. Find. Connect. Grow.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <Section spacing="lg">
      <Container size="md">
        <h1 className="font-serif text-5xl font-semibold text-forest-900 dark:text-cream-100 sm:text-6xl">
          About Voeq
        </h1>
        <p className="mt-4 font-serif text-2xl text-gold-600 dark:text-gold-500">
          Voeq — pronounced &quot;voke.&quot;
        </p>
        <div className="mt-12 space-y-6 text-lg text-forest-700/80 dark:text-cream-100/80">
          <p>
            Voeq is a marketplace directory connecting people with trusted vendors and service providers around them — food, fashion, tech, repairs, tailoring, accessories, and dozens of other everyday needs, all in one place.
          </p>
          <p>
            We started with a simple problem: people had no reliable way to discover the vendors and service providers around them. Word of mouth only goes so far. Voeq exists to close that gap — a directory where you can search by what you need, see verified vendors, and connect directly.
          </p>
          <p>
            Today, Voeq is a discovery platform — helping you find people, and helping vendors get found. We&apos;re building toward a future where you can discover, connect, and transact with vendors directly on Voeq.
          </p>
          <p className="pt-6 font-serif text-2xl text-forest-900 dark:text-cream-100">
            Find. Connect. Grow.
          </p>
        </div>
      </Container>
    </Section>
  );
}
