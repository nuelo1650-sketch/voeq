import { type Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { ComingSoonBadge } from '@/components/phase2/ComingSoonBadge';
import { VendorPageHeader, VendorSection } from '@/components/vendor/VendorPageShell';
import { AnimatedSection } from '@/components/landing/AnimatedSection';

export const metadata: Metadata = {
  title: 'Waybill',
  robots: { index: false, follow: false },
};

export default function WaybillPage() {
  return (
    <>
      <VendorPageHeader title="Waybill" subtitle="Track and manage deliveries across campuses." />
      <VendorSection>
        <Container size="md">
          <AnimatedSection>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">Waybill</h1>
              <ComingSoonBadge />
            </div>
            <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">This experience is coming soon.</p>
          </AnimatedSection>
        </Container>
      </VendorSection>
    </>
  );
}
