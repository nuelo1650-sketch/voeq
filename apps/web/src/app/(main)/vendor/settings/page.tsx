import { type Metadata } from 'next';
import { ThemeToggle } from '@/components/marketplace/ThemeToggle';
import { requireVendor } from '@/lib/auth-server';
import { VendorPageHeader, VendorSection } from '@/components/vendor/VendorPageShell';
import { AnimatedSection } from '@/components/landing/AnimatedSection';

export const metadata: Metadata = {
  title: 'Settings',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  requireVendor();
  return (
    <>
      <VendorPageHeader title="Settings" subtitle="Light or dark mode, plus more preferences soon." />
      <VendorSection>
        <div className="mx-auto max-w-xl">
          <AnimatedSection>
            <div className="rounded-2xl border border-cream-300 bg-cream-50 p-6 dark:border-forest-700 dark:bg-forest-800 dark:border-cream-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-forest-900 dark:text-cream-100">Theme</p>
                  <p className="text-sm text-forest-700/60 dark:text-cream-100/60">Light or dark mode</p>
                </div>
                <ThemeToggle />
              </div>
            </div>
            <p className="mt-4 text-sm text-forest-700/60 dark:text-cream-100/60">
              More settings coming soon (notifications, account deletion, etc.)
            </p>
          </AnimatedSection>
        </div>
      </VendorSection>
    </>
  );
}
