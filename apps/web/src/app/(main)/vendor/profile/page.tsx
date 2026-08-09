import { type Metadata } from 'next';
import { getMyVendor } from '@/lib/vendor-client';
import { VendorProfileForm } from '@/components/vendor/VendorProfileForm';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';

export const metadata: Metadata = {
  title: 'Edit business profile',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function VendorProfilePage() {
  let result;
  try {
    result = await getMyVendor();
  } catch {
    result = { error: 'Unauthorized' };
  }
  if (!('vendor' in result)) {
    return (
      <Section spacing="lg">
        <Container size="md">
          <p className="py-16 text-center text-sm text-forest-700/60 dark:text-cream-100/60">Please sign in to manage your vendor profile.</p>
        </Container>
      </Section>
    );
  }
  return <VendorProfileForm vendor={result.vendor} />;
}
