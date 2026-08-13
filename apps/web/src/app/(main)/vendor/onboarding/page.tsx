import { type Metadata } from 'next';
import { redirect } from 'next/navigation';
import { serverGetMyVendor as getMyVendor } from '@/lib/vendor-server';

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
    const progress = typeof vendor.onboardingProgress === 'number' && !Number.isNaN(vendor.onboardingProgress)
      ? vendor.onboardingProgress
      : 0;
    const step = Math.min(5, Math.max(1, Math.floor(progress / 20) + 1));
    redirect(`/vendor/onboarding/step-${step}`);
  }

  redirect('/vendor/onboarding/step-1');
}
