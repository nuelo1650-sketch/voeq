'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { signOut } from '@/lib/auth-client';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils';
import { ChevronRightIcon, StarIcon } from '@/components/icons';

const NAV_ITEMS = [
  { href: '/vendor', label: 'Overview', icon: 'home' },
  { href: '/vendor/listings', label: 'Listings', icon: 'listings' },
  { href: '/vendor/profile', label: 'Profile', icon: 'profile' },
  { href: '/vendor/analytics', label: 'Analytics', icon: 'analytics' },
  { href: '/vendor/settings', label: 'Settings', icon: 'settings' },
];

const ICONS: Record<string, (props: { className?: string }) => React.ReactNode> = {
  home: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.75L12 3l9 6.75V20a2 2 0 01-2 2H5a2 2 0 01-2-2V9.75z" />
      <path d="M9 21V12h6v9" />
    </svg>
  ),
  listings: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  ),
  profile: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  analytics: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M7 16l4-8 4 5 5-10" />
    </svg>
  ),
  settings: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51 1H2a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V2a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H22a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
};

export default function VendorChrome({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-forest-900">
      <header className="sticky top-0 z-40 border-b border-cream-200 bg-cream-50/80 backdrop-blur dark:border-forest-700 dark:bg-forest-900/80">
        <Container size="xl">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg p-2 text-forest-700 hover:bg-cream-200 lg:hidden dark:text-cream-100 dark:hover:bg-forest-800"
                onClick={() => setMobileOpen((prev) => !prev)}
                aria-label="Toggle navigation"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-5 w-5">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </button>
              <Link href="/vendor" className="flex items-center gap-2">
                <Logo size="md" />
                <span className="text-lg font-semibold tracking-tight text-forest-900 dark:text-cream-100">Voeq</span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<StarIcon className="h-4 w-4" />}
                onClick={async () => {
                  await signOut();
                  router.replace('/signin');
                }}
              >
                Sign out
              </Button>
            </div>
          </div>
        </Container>
      </header>
      <Container size="xl">
        <div className="grid grid-cols-1 gap-6 py-6 lg:grid-cols-[220px_1fr]">
          <aside
            className={cn(
              'lg:block',
              mobileOpen ? 'block' : 'hidden',
            )}
          >
            <nav className="flex flex-col gap-1 rounded-2xl border border-cream-200 bg-cream-50/60 p-2 dark:border-forest-700 dark:bg-forest-900/60" aria-label="Vendor">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;
                const Icon = ICONS[item.icon];
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition',
                      active
                        ? 'bg-forest-700 text-cream-100 shadow-sm'
                        : 'text-forest-700 hover:bg-cream-200 dark:text-cream-100 dark:hover:bg-forest-800',
                    )}
                  >
                    {Icon ? <Icon className={cn('h-4 w-4', active ? 'text-cream-100' : 'text-forest-500 dark:text-cream-100/70')} /> : null}
                    <span className="flex-1">{item.label}</span>
                    {active ? <ChevronRightIcon className="h-4 w-4 text-cream-100/80" /> : null}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-4 hidden rounded-2xl border border-cream-200 bg-cream-50/60 p-4 dark:border-forest-700 dark:bg-forest-900/60 lg:block">
              <p className="text-xs font-semibold uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">Need help?</p>
              <p className="mt-2 text-sm text-forest-700/80 dark:text-cream-100/80">Use the quick actions on your dashboard to update your profile or create a listing.</p>
            </div>
          </aside>
          <main className="min-w-0">
            <div className="animate-[fadeIn_0.25s_ease-out]">{children}</div>
          </main>
        </div>
      </Container>
    </div>
  );
}
