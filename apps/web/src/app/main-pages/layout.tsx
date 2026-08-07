'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AgreementModal } from '@/components/modals/AgreementModal';
import { CampusSelectModal } from '@/components/modals/CampusSelectModal';
import { getMe, signOut } from '@/lib/auth-client';
import type { AuthUser } from '@/lib/auth-client';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { ThemeToggle } from '@/components/marketplace/ThemeToggle';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAgreement, setShowAgreement] = useState(false);
  const [showCampus, setShowCampus] = useState(false);

  useEffect(() => {
    getMe()
      .then((data) => {
        setUser(data.user);
        if (!data.user.agreementAcceptedAt) {
          setShowAgreement(true);
        } else if (!data.user.defaultCampusId) {
          setShowCampus(true);
        }
      })
      .catch(() => {
        router.replace('/signin');
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
              <ThemeToggle />
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Sign out
              </Button>
            </nav>
          </div>
        </Container>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      <AgreementModal isOpen={showAgreement} onAccepted={handleAgreementAccepted} />
      <CampusSelectModal isOpen={showCampus} onSelected={handleCampusSelected} />
    </div>
  );
}
