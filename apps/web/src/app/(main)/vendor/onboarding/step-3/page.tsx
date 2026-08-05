import { type Metadata } from 'next';
import { OnboardingWizard } from '@/components/vendor/OnboardingWizard';
import { ProfilePhotoUpload } from '@/components/vendor/ProfilePhotoUpload';

export const metadata: Metadata = {
  title: 'Vendor onboarding — Step 3',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function Step3Page() {
  return (
    <OnboardingWizard currentStep={3}>
      <h2 className="mb-6 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">
        Profile photo
      </h2>
      <ProfilePhotoUpload />
    </OnboardingWizard>
  );
}
