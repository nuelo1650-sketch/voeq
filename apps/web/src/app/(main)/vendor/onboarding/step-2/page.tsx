import { type Metadata } from 'next';
import { OnboardingWizard } from '@/components/vendor/OnboardingWizard';
import { ContactLocationForm } from '@/components/vendor/ContactLocationForm';
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
          </AnimatedSection>
        </Container>
      </VendorSection>
    </>
  );
}
