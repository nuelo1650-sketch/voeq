'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AgreementModal } from '@/components/modals/AgreementModal';
import { CampusSelectModal } from '@/components/modals/CampusSelectModal';
import { getMe, signOut } from '@/lib/auth-client';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { ThemeToggle } from '@/components/marketplace/ThemeToggle';
import { NotificationBell } from '@/components/notifications/NotificationBell';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<Awaited<ReturnType<typeof getMe>>['user'] | null>(null);
  const [showAgreement, setShowAgreement] = useState(false);
  const [showCampus, setShowCampus] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    getMe()
      .then((data) => {
        setMe(data.user);
        if (!data.user.agreementAcceptedAt) {
          setShowAgreement(true);
        } else if (!data.user.defaultCampusId) {
          setShowCampus(true);
        }
      })
      .catch(() => {
        setMe(null);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleAgreementAccepted = () => {
    setShowAgreement(false);
    setShowCampus(true);
  };

  const handleCampusSelected = () => {
    setShowCampus(false);
    router.refresh();
  };

  const mobileLinks = [
    { href: '/browse', label: 'Browse' },
    { href: '/profile', label: 'Profile' },
    { href: '/wishlist', label: 'Wishlist' },
    { href: '/following', label: 'Following' },
    { href: '/settings', label: 'Settings' },
  ];
  const handleMobileNav = () => setMobileOpen(false);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/signin');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-forest-700/70">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-forest-900">
      <header className="sticky top-0 z-40 border-b border-cream-200 bg-cream-50/80 backdrop-blur dark:border-forest-700 dark:bg-forest-900/80">
        <Container size="lg">
          <div className="flex h-16 items-center justify-between">
            <Link href="/home" aria-label="Voeq home">
              <Logo size="sm" />
            </Link>
            <nav className="flex items-center gap-2">
              {me && (
                <>
                  <Link
                    href="/browse"
                    className="hidden text-sm font-medium text-forest-700 hover:text-forest-900 sm:inline-block dark:text-cream-100 dark:hover:text-white"
                  >
                    Browse
                  </Link>
                  <Link
                    href="/profile"
                    className="hidden text-sm font-medium text-forest-700 hover:text-forest-900 sm:inline-block dark:text-cream-100 dark:hover:text-white"
                  >
                    Profile
                  </Link>
                </>
              )}
              <ThemeToggle />
              {me && <NotificationBell />}
              {me && (
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  Sign out
                </Button>
              )}
            </nav>
          {mobileOpen && (
            <div className="md:hidden">
              <div className="space-y-1 border-t border-cream-200 px-4 pb-4 pt-3 dark:border-forest-700">
                {mobileLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleMobileNav}
                    className="block rounded-md px-3 py-2 text-sm font-medium text-forest-700 hover:bg-cream-200 dark:text-cream-100 dark:hover:bg-forest-800"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </Container>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      <AgreementModal isOpen={showAgreement} onAccepted={handleAgreementAccepted} />
      <CampusSelectModal isOpen={showCampus} onSelected={handleCampusSelected} />
    </div>
  );
}
