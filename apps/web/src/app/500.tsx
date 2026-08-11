'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';

export default function Error500() {
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    // Check localStorage for retry count to prevent infinite loops
    const stored = localStorage.getItem('error500_retry_count');
    const count = stored ? parseInt(stored, 10) : 0;
    setRetryCount(count);

    // Reset after 5 minutes
    const timeout = setTimeout(() => {
      localStorage.removeItem('error500_retry_count');
      setRetryCount(0);
    }, 300000);

    return () => clearTimeout(timeout);
  }, []);

  const handleRetry = () => {
    if (retryCount >= MAX_RETRIES) {
      return;
    }
    
    localStorage.setItem('error500_retry_count', String(retryCount + 1));
    window.location.reload();
  };

  return (
    <Section spacing="xl" className="min-h-[60vh] flex items-center">
      <Container size="md">
        <div className="text-center">
          <h1 className="font-serif text-5xl font-semibold text-forest-900 dark:text-cream-100">
            500
          </h1>
          <p className="mt-4 text-lg text-forest-700/70 dark:text-cream-100/70">
            Something went wrong on our end. We&apos;re looking into it.
          </p>
          {retryCount >= MAX_RETRIES && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              Multiple retries failed. Please try again later or contact support.
            </p>
          )}
          <div className="mt-8 flex justify-center gap-2">
            <Button 
              onClick={handleRetry}
              disabled={retryCount >= MAX_RETRIES}
            >
              {retryCount >= MAX_RETRIES ? 'Max retries reached' : 'Try again'}
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Go home</Link>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
