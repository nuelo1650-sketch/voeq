'use client';

import { useEffect, useState } from 'react';
import { StepIndicator } from './StepIndicator';
import { ProgressMeter } from './ProgressMeter';
import { getMyVendor } from '@/lib/vendor-client';
import type { VendorProfile } from '@/lib/vendor-client';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';

interface OnboardingWizardProps {
  children: React.ReactNode;
  currentStep: 1 | 2 | 3 | 4 | 5;
}

const STEPS = [
  { number: 1, label: 'Business' },
  { number: 2, label: 'Contact' },
  { number: 3, label: 'Photo' },
  { number: 4, label: 'Listing' },
  { number: 5, label: 'Go live' },
];

export function OnboardingWizard({ children, currentStep }: OnboardingWizardProps) {
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyVendor()
      .then((res) => {
        if ('vendor' in res) {
          setVendor(res.vendor);
          setProgress(res.progress);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const steps = STEPS.map((s) => ({
    ...s,
    completed: s.number < currentStep || (s.number === 5 && vendor?.status === 'live'),
    current: s.number === currentStep,
  }));

  if (loading) {
    return (
      <Container size="md">
        <div className="py-16 text-center text-sm text-forest-700/60">Loading…</div>
      </Container>
    );
  }

  return (
    <Section spacing="md">
      <Container size="md">
        <div className="mb-8">
          <ProgressMeter progress={progress} />
        </div>

        <div className="mb-12">
          <StepIndicator steps={steps} />
        </div>

        <div className="rounded-2xl border border-cream-300 bg-cream-50 p-6 sm:p-8 dark:border-forest-700 dark:bg-forest-800">
          {children}
        </div>
      </Container>
    </Section>
  );
}
