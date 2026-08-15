import { type Metadata } from 'next';
import { OnboardingWizard } from '@/components/vendor/OnboardingWizard';
import { ContactLocationForm } from '@/components/vendor/ContactLocationForm';
import { VendorHoursOnboarding } from '@/components/vendor/VendorHoursOnboarding';
import { requireVendor } from '@/lib/auth-server';
import { VendorPageHeader } from '@/components/vendor/VendorPageShell';

export const metadata: Metadata = {
  title: 'Vendor onboarding — Step 2',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function Step2Page() {
  requireVendor();
  return (
    <>
      <VendorPageHeader title="Contact & location" subtitle="Where can students reach you?" />
      <OnboardingWizard currentStep={2}>
        <ContactLocationForm />
      </OnboardingWizard>
      <div className="mx-auto mt-8 w-full max-w-5xl px-4 pb-8 md:px-8">
        <h3 className="mb-3 font-serif text-lg font-semibold text-forest-900 dark:text-cream-100">
          Operating hours <span className="text-sm font-normal text-forest-700/60 dark:text-cream-100/60">(optional)</span>
        </h3>
        <VendorHoursOnboarding />
      </div>
    </>
  );
}
