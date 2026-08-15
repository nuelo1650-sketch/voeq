import { type Metadata } from 'next';
import { requireVendor } from '@/lib/auth-server';
import { ReviewAndGoLive } from '@/components/vendor/ReviewAndGoLive';

export const metadata: Metadata = {
  title: 'Vendor onboarding — Step 4',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function Step4Page() {
  requireVendor();
  return <ReviewAndGoLive />;
}
