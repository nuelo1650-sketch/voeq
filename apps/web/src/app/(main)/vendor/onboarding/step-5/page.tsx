import { type Metadata } from 'next';
import { OnboardingWizard } from '@/components/vendor/OnboardingWizard';
import { ReviewAndGoLive } from '@/components/vendor/ReviewAndGoLive';

export const metadata: Metadata = {
  title: 'Vendor onboarding — Step 5',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function Step5Page() {
  return (
    <OnboardingWizard currentStep={5}>
      <h2 className="mb-6 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">
        Review & go live
      </h2>
      <ReviewAndGoLive />
    </OnboardingWizard>
  );
}
