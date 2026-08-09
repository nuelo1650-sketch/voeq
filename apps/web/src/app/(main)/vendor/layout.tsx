import { redirect } from 'next/navigation';
import { serverGetMyVendor as getMyVendor } from '@/lib/vendor-server';
import VendorChrome from '@/components/vendor/VendorChrome';

export default async function VendorLayout({ children }: { children: React.ReactNode }) {
  const vendorResult = await getMyVendor().catch(() => null);

  if (!vendorResult || 'hasVendor' in vendorResult) {
    redirect('/become-vendor');
  }

  return <VendorChrome>{children}</VendorChrome>;
}
