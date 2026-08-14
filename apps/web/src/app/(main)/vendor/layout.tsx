import { redirect } from 'next/navigation';
import { serverGetMe as getMe } from '@/lib/auth-server';
import { serverGetMyVendor as getMyVendor } from '@/lib/vendor-server';
import VendorChrome from '@/components/vendor/VendorChrome';

export default async function VendorLayout({ children }: { children: React.ReactNode }) {
  const me = await getMe().catch(() => null);
  // If the user is not a vendor at all, send them to the upgrade flow.
  if (!me?.user || (me.user.role !== 'vendor' && me.user.role !== 'admin' && me.user.role !== 'super_admin')) {
    redirect('/become-vendor');
  }

  const vendorResult = await getMyVendor().catch(() => null);
  // A vendor-role user without a Vendor row yet is mid-onboarding — let them
  // through so /vendor/onboarding can create the row. Only bounce true
  // non-vendors (handled above) or never send them here.
  if (!vendorResult) redirect('/become-vendor');

  return <VendorChrome>{children}</VendorChrome>;
}
