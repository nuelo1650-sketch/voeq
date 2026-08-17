import { type Metadata } from 'next';
import { OnboardingWizard } from '@/components/vendor/OnboardingWizard';
import { PhotoListingForm } from '@/components/vendor/PhotoListingForm';
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
      <VendorPageHeader title="Photo & listing" subtitle="Add a profile photo and your first listing." />
      <OnboardingWizard currentStep={3}>
        <PhotoListingForm />
      </OnboardingWizard>
    </>
  );
}
