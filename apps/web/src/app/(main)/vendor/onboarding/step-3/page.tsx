import { type Metadata } from 'next';
import { OnboardingWizard } from '@/components/vendor/OnboardingWizard';
import { ProfilePhotoUpload } from '@/components/vendor/ProfilePhotoUpload';
import { requireVendor } from '@/lib/auth-server';
import { VendorPageHeader, VendorSection } from '@/components/vendor/VendorPageShell';
import { AnimatedSection } from '@/components/landing/AnimatedSection';
import { Container } from '@/components/ui/Container';

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
      <VendorSection>
        <Container size="md">
          <AnimatedSection>
            <OnboardingWizard currentStep={3}>
              <ProfilePhotoUpload />
            </OnboardingWizard>
          </AnimatedSection>
        </Container>
      </VendorSection>
    </>
  );
}
