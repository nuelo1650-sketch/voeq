'use client';

import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <Section spacing="xl" className="min-h-[60vh] flex items-center">
      <Container size="md">
        <div className="text-center">
          <h1 className="font-serif text-5xl font-semibold text-forest-900 dark:text-cream-100">
            404
          </h1>
          <p className="mt-4 text-lg text-forest-700/70 dark:text-cream-100/70">
            We can&apos;t find that page. It may have been moved or deleted.
          </p>
          <div className="mt-8">
            <Button>
              <Link href="/">Go home</Link>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
