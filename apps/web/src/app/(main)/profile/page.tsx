import { type Metadata } from 'next';
import { serverGetMe as getMe } from '@/lib/auth-server';
import { Container } from '@/components/ui/Container';
import { ProfileForm } from '@/components/marketplace/ProfileForm';
import { ThemeToggle } from '@/components/marketplace/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { serverSignOut as signOut } from '@/lib/auth-server';
import { VendorPageHeader, VendorSection } from '@/components/vendor/VendorPageShell';
import { AnimatedSection } from '@/components/landing/AnimatedSection';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Manage your Voeq account.',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  let me;
  try {
    me = await getMe();
  } catch {
    me = null;
  }
  const user = me?.user ?? null;
  const campus = user?.defaultCampus ?? null;

  if (!user) {
    return (
      <VendorPageHeader title="Profile" subtitle="Manage your Voeq account and preferences." />
    );
  }

  return (
    <>
      <VendorPageHeader title="Profile" subtitle="Manage your Voeq account and preferences." />
      <VendorSection>
        <Container size="md">
          <AnimatedSection>
            <div className="space-y-6">
              <div className="rounded-2xl border border-cream-300 bg-cream-50 p-6 dark:border-forest-700 dark:bg-forest-800">
                <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Account</h2>
                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <span className="text-forest-700/60 dark:text-cream-100/60">Email</span>
                    <p className="font-medium text-forest-900 dark:text-cream-100">{user.email}</p>
                  </div>
                  <div>
                    <span className="text-forest-700/60 dark:text-cream-100/60">Role</span>
                    <p className="font-medium text-forest-900 dark:text-cream-100 capitalize">{user.role}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-cream-300 bg-cream-50 p-6 dark:border-forest-700 dark:bg-forest-800">
                <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Edit profile</h2>
                <div className="mt-4">
                  <ProfileForm initialName={user.name ?? ''} initialImage={user.image ?? null} />
                </div>
              </div>

              {campus && (
                <div className="rounded-2xl border border-cream-300 bg-cream-50 p-6 dark:border-forest-700 dark:bg-forest-800">
                  <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Campus</h2>
                  <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">
                    Currently browsing: <span className="font-semibold text-forest-900 dark:text-cream-100">{campus.institution.name} · {campus.name}</span>
                  </p>
                </div>
              )}

              <div className="rounded-2xl border border-cream-300 bg-cream-50 p-6 dark:border-forest-700 dark:bg-forest-800">
                <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Saved & Following</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button variant="outline" asChild>
                    <a href="/wishlist">Wishlist</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/following">Following</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/buyer-dashboard">Buyer Dashboard</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/settings">Settings</a>
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-cream-300 bg-cream-50 p-6 dark:border-forest-700 dark:bg-forest-800">
                <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Appearance</h2>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-forest-700/70 dark:text-cream-100/70">Theme</span>
                  <ThemeToggle />
                </div>
              </div>

              <form
                action={async () => {
                  'use server';
                  await signOut();
                }}
              >
                <Button variant="destructive" type="submit" fullWidth>
                  Sign out
                </Button>
              </form>
            </div>
          </AnimatedSection>
        </Container>
      </VendorSection>
    </>
  );
}
