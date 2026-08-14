import { redirect } from 'next/navigation';
import { serverGetMe as getMe } from '@/lib/auth-server';
import { serverGetMyVendor as getMyVendor } from '@/lib/vendor-server';
import VendorChrome from '@/components/vendor/VendorChrome';

export default async function VendorLayout({ children }: { children: React.ReactNode }) {
  const me = await getMe().catch(() => null);
  const role = me?.user?.role;

  // Only non-vendor roles are sent to the upgrade flow. A vendor (or admin) may
  // have a transient /me failure or not-yet-created Vendor row — never bounce
  // them out of /vendor for that; let the inner pages (onboarding) create it.
  const isVendorRole = role === 'vendor' || role === 'admin' || role === 'super_admin';
  if (!me?.user || !isVendorRole) {
    redirect('/become-vendor');
  }

  const vendorResult = await getMyVendor().catch(() => null);

  // Vendor-role user without a Vendor row yet → onboarding (step-1 creates it).
  // If /me failed entirely (transient 503), fall through so the page itself
  // can surface an error rather than looping back to /become-vendor.
  if (vendorResult && !('vendor' in vendorResult)) {
    redirect('/vendor/onboarding/step-1');
  }

  return <VendorChrome>{children}</VendorChrome>;
}
