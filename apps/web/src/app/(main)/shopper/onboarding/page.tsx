import { type Metadata } from 'next';
import { requireShopper } from '@/lib/auth-server';
import { ShopperOnboarding } from '@/components/shopper/ShopperOnboarding';

export const metadata: Metadata = {
  title: 'Shopper onboarding',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function ShopperOnboardingPage() {
  // Server-enforced: only shoppers (buyers) may enter. Vendors/admins are
  // redirected to their own section.
  requireShopper();
  return <ShopperOnboarding />;
}
