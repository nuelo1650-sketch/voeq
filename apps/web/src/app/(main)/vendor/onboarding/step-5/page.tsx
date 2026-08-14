import { type Metadata } from 'next';
import { OnboardingWizard } from '@/components/vendor/OnboardingWizard';
import { ReviewAndGoLive } from '@/components/vendor/ReviewAndGoLive';
import { requireVendor } from '@/lib/auth-server';
import { VendorPageHeader, VendorSection } from '@/components/vendor/VendorPageShell';
import { AnimatedSection } from '@/components/landing/AnimatedSection';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Vendor onboarding — Step 5',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function Step5Page() {
  requireVendor();
  return (
    <>
      <VendorPageHeader title="Review & go live" subtitle="Double-check everything before opening your storefront." />
      <VendorSection>
        <Container size="md">
          <AnimatedSection>
            <OnboardingWizard currentStep={5}>
              <ReviewAndGoLive />
            </OnboardingWizard>
          </AnimatedSection>
        </Container>
      </VendorSection>
    </>
  );
}
