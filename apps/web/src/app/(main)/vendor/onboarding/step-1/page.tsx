import { type Metadata } from 'next';
import { OnboardingWizard } from '@/components/vendor/OnboardingWizard';
import { BusinessBasicsForm } from '@/components/vendor/BusinessBasicsForm';
import { serverGetMyVendor as getMyVendor } from '@/lib/vendor-server';
import { requireVendor } from '@/lib/auth-server';
import { VendorPageHeader } from '@/components/vendor/VendorPageShell';

export const metadata: Metadata = {
  title: 'Vendor onboarding — Step 1',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function Step1Page() {
  await requireVendor();
  const result = await getMyVendor().catch(() => null);
  const initialData = result && 'vendor' in result ? {
    businessName: result.vendor.businessName,
    ownerName: result.vendor.ownerName,
    description: result.vendor.description,
  } : undefined;

  return (
    <>
      <VendorPageHeader title="Business basics" subtitle="Tell students what you offer." />
      <OnboardingWizard currentStep={1}>
        <BusinessBasicsForm initialData={initialData} />
      </OnboardingWizard>
    </>
  );
}
