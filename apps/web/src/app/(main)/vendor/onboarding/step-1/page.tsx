import { type Metadata } from 'next';
import { OnboardingWizard } from '@/components/vendor/OnboardingWizard';
import { BusinessBasicsForm } from '@/components/vendor/BusinessBasicsForm';
import { getMyVendor } from '@/lib/vendor-client';

export const metadata: Metadata = {
  title: 'Vendor onboarding — Step 1',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function Step1Page() {
  const result = await getMyVendor().catch(() => null);
  const initialData = result && 'vendor' in result ? {
    businessName: result.vendor.businessName,
    ownerName: result.vendor.ownerName,
    description: result.vendor.description,
  } : undefined;

  return (
    <OnboardingWizard currentStep={1}>
      <h2 className="mb-6 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">
        Business basics
      </h2>
      <BusinessBasicsForm initialData={initialData} />
    </OnboardingWizard>
  );
}
