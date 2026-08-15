import { type Metadata } from 'next';
import { OnboardingWizard } from '@/components/vendor/OnboardingWizard';
import { ProfilePhotoUpload } from '@/components/vendor/ProfilePhotoUpload';
import { requireVendor } from '@/lib/auth-server';
import { VendorPageHeader } from '@/components/vendor/VendorPageShell';

export const metadata: Metadata = {
  title: 'Vendor onboarding — Step 3',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function Step3Page() {
  requireVendor();
  return (
    <>
      <VendorPageHeader title="Profile photo" subtitle="Add a photo students will recognize." />
      <OnboardingWizard currentStep={3}>
        <ProfilePhotoUpload />
      </OnboardingWizard>
    </>
  );
}
