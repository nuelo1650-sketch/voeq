'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { StepIndicator } from './StepIndicator';
import { ProgressMeter } from './ProgressMeter';
import { getMyVendor } from '@/lib/vendor-client';
import type { VendorProfile } from '@/lib/vendor-client';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

interface OnboardingWizardProps {
  children: React.ReactNode;
  currentStep: 1 | 2 | 3 | 4 | 5;
}

const STEPS = [
  { number: 1, label: 'Business' },
  { number: 2, label: 'Contact' },
  { number: 3, label: 'Photos & listing' },
  { number: 4, label: 'Go live' },
];

export function OnboardingWizard({ children, currentStep }: OnboardingWizardProps) {
  const router = useRouter();
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setErrored(false);
    getMyVendor()
      .then((res) => {
        if ('vendor' in res) {
          setVendor(res.vendor);
          setProgress(res.progress);
          // Guard: pull users back only when their SAVED data shows they
          // haven't reached this step. Never redirect on a fetch failure —
          // a flaky/down API must not trap the user in a redirect loop.
          if (res.vendor.status !== 'live') {
            const actualStep = Math.min(4, Math.max(1, Math.floor(res.progress / 20) + 1));
            if (currentStep > actualStep) {
              router.replace(`/vendor/onboarding/step-${actualStep}`);
            }
          }
        }
      })
      .catch(() => {
        // API unreachable — keep the user on the current step, offer a retry.
        setErrored(true);
      })
      .finally(() => setLoading(false));
  }, [currentStep, router]);

  useEffect(() => {
    load();
  }, [load]);

  const steps = STEPS.map((s) => ({
    ...s,
    completed: s.number < currentStep || (s.number === 5 && vendor?.status === 'live'),
    current: s.number === currentStep,
  }));

  if (loading) {
    return (
      <Container size="md">
        <div className="py-16 text-center text-sm text-forest-700/60 dark:text-cream-100/60">Loading…</div>
      </Container>
    );
  }

  if (errored) {
    return (
      <Container size="md">
        <div className="rounded-2xl border border-cream-300 bg-cream-50 p-8 text-center dark:border-forest-700 dark:bg-forest-800 dark:border-cream-100">
          <p className="text-sm text-forest-700/80 dark:text-cream-100/80">
            We couldn&apos;t load your onboarding progress. Check your connection and try again.
          </p>
          <Button className="mt-4" onClick={load}>Retry</Button>
        </div>
      </Container>
    );
  }

  return (
    <Container size="md">
      <div className="mb-8">
        <ProgressMeter progress={progress} />
      </div>

      <div className="mb-12">
        <StepIndicator steps={steps} />
      </div>

      <div className="rounded-2xl border border-cream-300 bg-cream-50 p-6 sm:p-8 dark:border-forest-700 dark:bg-forest-800 dark:border-cream-100">
        {children}
      </div>
    </Container>
  );
}
