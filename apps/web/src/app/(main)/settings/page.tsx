import { type Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PreferencesForm } from '@/components/user/PreferencesForm';
import { DeleteAccountSection } from '@/components/user/DeleteAccountSection';
import { getMe } from '@/lib/auth-client';
import { getPreferences } from '@/lib/user-client';
import { getMyDisputes } from '@/lib/marketplace-client';
import { VendorPageHeader, VendorSection } from '@/components/vendor/VendorPageShell';
import { AnimatedSection } from '@/components/landing/AnimatedSection';

export const metadata: Metadata = {
  title: 'Settings',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  let me;
  try {
    me = await getMe();
  } catch {
    me = null;
  }
  if (!me?.user) {
    redirect('/signin');
  }

  const preferences = await getPreferences().catch(() => null);
  const disputes = await getMyDisputes().catch(() => ({ disputes: [] }));

  return (
    <>
      <VendorPageHeader title="Settings" subtitle="Manage notifications, disputes, and account preferences." />
      <VendorSection>
        <Container size="md">
          <AnimatedSection>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Email notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <PreferencesForm initialPreferences={preferences} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>My disputes</CardTitle>
                </CardHeader>
                <CardContent>
                  {disputes.disputes.length === 0 ? (
                    <p className="text-sm text-forest-700/60 dark:text-cream-100/60">
                      You haven&apos;t filed any disputes.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {disputes.disputes.map((d: any) => (
                        <li key={d.id} className="rounded-md border border-cream-300 bg-cream-50 p-3 dark:border-forest-700 dark:bg-forest-800">
                          <p className="text-sm font-medium text-forest-900 dark:text-cream-100">{d.reason}</p>
                          <p className="mt-1 text-xs text-forest-700/60 dark:text-cream-100/60">
                            Status: {d.status} · Filed {new Date(d.createdAt).toLocaleDateString()}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              <DeleteAccountSection />
            </div>
          </AnimatedSection>
        </Container>
      </VendorSection>
    </>
  );
}
