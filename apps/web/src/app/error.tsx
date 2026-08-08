'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <Section spacing="xl">
      <Container size="md">
        <div className="text-center">
          <h1 className="font-serif text-5xl font-semibold text-forest-900 dark:text-cream-100">
            Something went wrong
          </h1>
          <p className="mt-4 text-lg text-forest-700/70 dark:text-cream-100/70">
            We hit an unexpected error. Please try again.
          </p>
          {error.digest && (
            <p className="mt-2 font-mono text-xs text-forest-700/40 dark:text-cream-100/40">
              Error ID: {error.digest}
            </p>
          )}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button onClick={reset}>Try again</Button>
            <Button variant="outline" asChild>
              <Link href="/">Go home</Link>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
