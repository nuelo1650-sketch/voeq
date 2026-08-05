import { type Metadata } from 'next';
import { OnboardingWizard } from '@/components/vendor/OnboardingWizard';
import { FirstListingForm } from '@/components/vendor/FirstListingForm';

export const metadata: Metadata = {
  title: 'Vendor onboarding — Step 4',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function Step4Page() {
  return (
    <OnboardingWizard currentStep={4}>
      <h2 className="mb-6 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">
        Your first listing
      </h2>
      <FirstListingForm />
    </OnboardingWizard>
  );
}
