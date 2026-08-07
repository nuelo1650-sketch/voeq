import { type Metadata } from 'next';
import { getMyVendor } from '@/lib/vendor-client';
import { VendorProfileForm } from '@/components/vendor/VendorProfileForm';

export const metadata: Metadata = {
  title: 'Edit business profile',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function VendorProfilePage() {
  const result = await getMyVendor();
  if (!('vendor' in result)) return null;
  return <VendorProfileForm vendor={result.vendor} />;
}
