import { type Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getMyVendor } from '@/lib/vendor-client';

export const metadata: Metadata = {
  title: 'Vendor onboarding',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function OnboardingPage() {
  const result = await getMyVendor().catch(() => null);
  if (result && 'vendor' in result) {
    const { vendor } = result;
    if (vendor.status === 'live') redirect('/vendor');
    const step = Math.min(5, Math.max(1, Math.floor(vendor.onboardingProgress / 20) + 1));
    redirect(`/vendor/onboarding/step-${step}`);
  }

  redirect('/vendor/onboarding/step-1');
}
