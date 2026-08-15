import { type Metadata } from 'next';
import { redirect } from 'next/navigation';
import { serverGetMe as getMe } from '@/lib/auth-server';
import { serverGetMyVendor as getMyVendor } from '@/lib/vendor-server';
import { Container } from '@/components/ui/Container';
import { SearchIcon, WhatsAppIcon, StarIcon } from '@/components/icons';
import { VendorPageHeader, VendorSection, PageHeader } from '@/components/vendor/VendorPageShell';
import { AnimatedSection } from '@/components/landing/AnimatedSection';
import { BecomeVendorButton } from '@/components/vendor/BecomeVendorButton';

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
      <PageHeader
        title="Become a vendor"
        subtitle="List your business on Voeq and reach students on your campus. Free to start."
      />
      <VendorSection>
        <Container size="md">
          <AnimatedSection>
            <div className="space-y-6">
              {[
                { title: 'Reach students', desc: 'Get discovered by students actively looking for what you offer.', Icon: SearchIcon },
                { title: 'Direct WhatsApp', desc: 'Students message you directly. No platform fees in Phase 1.', Icon: WhatsAppIcon },
                { title: 'Build trust', desc: 'Earn badges and reviews that help you stand out.', Icon: StarIcon },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 rounded-2xl border border-cream-300 bg-cream-50 p-5 transition hover:border-gold-500/40 dark:border-forest-700 dark:bg-forest-800 dark:border-cream-100">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-500/15 text-gold-600 dark:text-gold-400">
                    <item.Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-forest-900 dark:text-cream-100">{item.title}</p>
                    <p className="mt-1 text-sm text-forest-700/70 dark:text-cream-100/70">{item.desc}</p>
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <BecomeVendorButton />
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </VendorSection>
    </>
  );
}
