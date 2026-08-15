'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AgreementModal } from '@/components/modals/AgreementModal';
import { CampusSelectModal } from '@/components/modals/CampusSelectModal';
import { getMe, signOut } from '@/lib/auth-client';
import { AppSidebar } from '@/components/navigation/AppSidebar';
import { AppBottomNav } from '@/components/navigation/AppBottomNav';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<Awaited<ReturnType<typeof getMe>>['user'] | null>(null);
  const [showAgreement, setShowAgreement] = useState(false);
  const [showCampus, setShowCampus] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    getMe()
      .then((data) => {
        setMe(data.user);
        if (!data.user.agreementAcceptedAt) {
          setShowAgreement(true);
        } else if (!data.user.defaultCampusId) {
          // Force campus selection for any user missing a campus — buyers on
          // first run, or a live vendor who later clears theirs. Vendors still
          // in onboarding set their campus at step-2, so skip them there to
          // avoid a double prompt.
          const isVendorInOnboarding =
            data.user.role === 'vendor' && data.user.vendorStatus !== 'live';
          if (!isVendorInOnboarding) setShowCampus(true);
        }
      })
      .catch(() => {
        setMe(null);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleAgreementAccepted = () => {
    setShowAgreement(false);
    // Re-fetch the latest user so agreementAcceptedAt is reflected in state
    // immediately (otherwise downstream guards like become-vendor would still
    // see the stale null and bounce to /signin).
    getMe()
      .then((data) => setMe(data.user))
      .catch(() => {})
      .finally(() => {
        setShowCampus(true);
        router.refresh();
      });
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
        <p className="text-sm text-forest-700/70 dark:text-cream-100/70">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-forest-900 dark:bg-forest-800">
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} onSignOut={handleSignOut} />
      <AppBottomNav />
      <div className={`transition-[padding] duration-200 md:pl-[var(--sb-w)]`} style={{ ['--sb-w' as string]: collapsed ? '76px' : '16rem' }}>
        <main className="mx-auto max-w-6xl px-4 pb-24 pt-8 md:px-8 md:pb-8">{children}</main>
      </div>
      <AgreementModal isOpen={showAgreement} onAccepted={handleAgreementAccepted} />
      <CampusSelectModal isOpen={showCampus} onSelected={handleCampusSelected} />
    </div>
  );
}
