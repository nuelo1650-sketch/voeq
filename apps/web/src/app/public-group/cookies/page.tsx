import { type Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  robots: { index: true, follow: true },
};

export default function CookiesPage() {
  return (
    <Section spacing="lg">
      <Container size="md">
        <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100 sm:text-4xl">Cookie Policy</h1>
        <p className="mt-3 text-base text-forest-700/80 dark:text-cream-100/80">How Voeq uses cookies and similar technologies.</p>

        <div className="mt-10 space-y-6 text-sm text-forest-700/80 dark:text-cream-100/80">
          <div>
            <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Essential cookies</h2>
            <p className="mt-2">Required for authentication, security, and basic app functionality. These cannot be disabled.</p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Analytics cookies</h2>
            <p className="mt-2">Help us understand how students use Voeq so we can improve performance and usability.</p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Marketing cookies</h2>
            <p className="mt-2">Used to measure campaign effectiveness and show relevant content. Optional.</p>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Manage consent</h2>
          <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">Use the banner at the bottom of the page to accept, reject, or customize preferences.</p>
          <div className="mt-4 flex gap-3">
            <Button variant="primary" size="sm" asChild>
              <Link href="/privacy">Privacy policy</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/terms">Terms of service</Link>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
