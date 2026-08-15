import { requireVendor } from '@/lib/auth-server';
import VendorChrome from '@/components/vendor/VendorChrome';

export default async function VendorLayout({ children }: { children: React.ReactNode }) {
  // Server-enforced role gate: only vendors (and admins) may enter /vendor/*.
  // Shoppers who hit a /vendor URL are redirected to their own section.
  // Unauthenticated users go to /signin. This makes role-switch-by-URL impossible.
  await requireVendor();

  return <VendorChrome>{children}</VendorChrome>;
}
