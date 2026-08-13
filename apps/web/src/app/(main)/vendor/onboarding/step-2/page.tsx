import { type Metadata } from 'next';
import { OnboardingWizard } from '@/components/vendor/OnboardingWizard';
import { ContactLocationForm } from '@/components/vendor/ContactLocationForm';
import { VendorHoursOnboarding } from '@/components/vendor/VendorHoursOnboarding';
import { VendorPageHeader, VendorSection } from '@/components/vendor/VendorPageShell';
import { AnimatedSection } from '@/components/landing/AnimatedSection';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Vendor onboarding — Step 2',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function Step2Page() {
  return (
    <>
      <VendorPageHeader title="Contact & location" subtitle="Where can students reach you?" />
      <VendorSection>
        <Container size="md">
          <AnimatedSection>
            <OnboardingWizard currentStep={2}>
              <ContactLocationForm />
            </OnboardingWizard>
            <div className="mt-8">
              <h3 className="mb-3 font-serif text-lg font-semibold text-forest-900 dark:text-cream-100">
                Operating hours <span className="text-sm font-normal text-forest-700/60">(optional)</span>
              </h3>
              <VendorHoursOnboarding />
            </div>
          </AnimatedSection>
        </Container>
      </VendorSection>
    </>
  );
}
