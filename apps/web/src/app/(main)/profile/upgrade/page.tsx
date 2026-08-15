import { type Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { ComingSoonBadge } from '@/components/phase2/ComingSoonBadge';
import { VendorPageHeader, VendorSection } from '@/components/vendor/VendorPageShell';
import { AnimatedSection } from '@/components/landing/AnimatedSection';

export const metadata: Metadata = {
  title: 'Upgrade to Pro',
  robots: { index: false, follow: false },
};

export default function UpgradePage() {
  return (
    <>
      <VendorPageHeader title="Upgrade to Pro" subtitle="Unlock premium features for your vendor business." />
      <VendorSection>
        <Container size="md">
          <AnimatedSection>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Free</CardTitle>
                  <CardDescription>Current plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>✓ Unlimited listings</li>
                    <li>✓ WhatsApp connect</li>
                    <li>✓ Basic analytics</li>
                    <li>✓ Customer reviews</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Pro</CardTitle>
                    <ComingSoonBadge />
                  </div>
                  <CardDescription>₦800/month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>✓ Everything in Free</li>
                    <li>✓ Featured placement</li>
                    <li>✓ Advanced analytics</li>
                    <li>✓ Priority support</li>
                    <li>✓ More photos per listing</li>
                    <li>✓ Custom storefront theme</li>
                  </ul>
                  <button
                    disabled
                    className="mt-6 w-full rounded-full bg-gold-500 px-6 py-3 text-sm font-medium text-forest-900 opacity-50 dark:text-cream-100"
                  >
                    Coming in January 2027
                  </button>
                </CardContent>
              </Card>
            </div>
          </AnimatedSection>
        </Container>
      </VendorSection>
    </>
  );
}
