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
        } else if (!data.user.homeSeenAt && !data.user.defaultCampusId) {
          // During first-run onboarding the HomeWizard owns campus selection,
          // so we intentionally do NOT also pop the layout campus modal here
          // (that would double-prompt). Only prompt from the layout once the
          // user has finished onboarding (homeSeenAt set) but later clears
          // their campus.
          setShowCampus(false);
        } else if (data.user.homeSeenAt && !data.user.defaultCampusId) {
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
