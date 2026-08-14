import { type Metadata } from 'next';
import { OnboardingWizard } from '@/components/vendor/OnboardingWizard';
import { FirstListingForm } from '@/components/vendor/FirstListingForm';
import { requireVendor } from '@/lib/auth-server';
import { VendorPageHeader, VendorSection } from '@/components/vendor/VendorPageShell';
import { AnimatedSection } from '@/components/landing/AnimatedSection';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Vendor onboarding — Step 4',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function Step4Page() {
  requireVendor();
  return (
    <>
      <VendorPageHeader title="Your first listing" subtitle="Add one item or service to get started." />
      <VendorSection>
        <Container size="md">
          <AnimatedSection>
            <OnboardingWizard currentStep={4}>
              <FirstListingForm />
            </OnboardingWizard>
          </AnimatedSection>
        </Container>
      </VendorSection>
    </>
  );
}
