import { type Metadata } from 'next';
import { OnboardingWizard } from '@/components/vendor/OnboardingWizard';
import { ContactLocationForm } from '@/components/vendor/ContactLocationForm';

export const metadata: Metadata = {
  title: 'Vendor onboarding — Step 2',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function Step2Page() {
  return (
    <OnboardingWizard currentStep={2}>
      <h2 className="mb-6 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">
        Contact & location
      </h2>
      <ContactLocationForm />
    </OnboardingWizard>
  );
}
