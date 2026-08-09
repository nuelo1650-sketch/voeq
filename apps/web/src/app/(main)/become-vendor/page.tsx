import { type Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getMe } from '@/lib/auth-client';
import { getMyVendor } from '@/lib/vendor-client';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { VendorPageHeader, VendorSection } from '@/components/vendor/VendorPageShell';
import { AnimatedSection } from '@/components/landing/AnimatedSection';

export const metadata: Metadata = {
  title: 'Become a vendor',
  description: 'List your business on Voeq and reach students on your campus.',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function BecomeVendorPage() {
  const me = await getMe().catch(() => null);
  if (!me?.user) redirect('/signin');
  if (!me.user.agreementAcceptedAt) redirect('/signin');
  if (!me.user.defaultCampusId) redirect('/select-campus');

  const vendorResult = await getMyVendor().catch(() => null);
  if (vendorResult && 'vendor' in vendorResult && vendorResult.vendor.status === 'live') {
    redirect('/vendor');
  }

  return (
    <>
      <VendorPageHeader
        title="Become a vendor"
        subtitle="List your business on Voeq and reach students on your campus. Free to start."
      />
      <VendorSection>
        <Container size="md">
          <AnimatedSection>
            <div className="space-y-6">
              {[
                { title: 'Reach students', desc: 'Get discovered by students actively looking for what you offer.' },
                { title: 'Direct WhatsApp', desc: 'Students message you directly. No platform fees in Phase 1.' },
                { title: 'Build trust', desc: 'Earn badges and reviews that help you stand out.' },
              ].map((item) => (
                <div key={item.title} className="flex gap-3 rounded-lg border border-cream-300 bg-cream-50 p-4 dark:border-forest-700 dark:bg-forest-800">
                  <div>
                    <p className="font-semibold text-forest-900 dark:text-cream-100">{item.title}</p>
                    <p className="text-sm text-forest-700/70 dark:text-cream-100/70">{item.desc}</p>
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <Button size="lg" fullWidth>
                  <Link href="/vendor/onboarding/step-1">Get started</Link>
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </VendorSection>
    </>
  );
}
