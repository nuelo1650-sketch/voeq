import { type Metadata } from 'next';
import { getMyVendor } from '@/lib/vendor-client';
import { VendorProfileForm } from '@/components/vendor/VendorProfileForm';
import { VendorPageHeader, VendorSection } from '@/components/vendor/VendorPageShell';

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
      <VendorPageHeader title="Business profile" subtitle="Manage your storefront, contact details, and preferences." />
    );
  }

  return (
    <>
      <VendorPageHeader title="Business profile" subtitle="Manage your storefront, contact details, and preferences." />
      <VendorSection title="Store details" subtitle="Update the information students see on your profile.">
        <VendorProfileForm vendor={result.vendor} />
      </VendorSection>
    </>
  );
}
