'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { signOut } from '@/lib/auth-client';
import { getMyVendor } from '@/lib/vendor-client';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/vendor', label: 'Overview' },
  { href: '/vendor/listings', label: 'Listings' },
  { href: '/vendor/profile', label: 'Profile' },
  { href: '/vendor/analytics', label: 'Analytics' },
  { href: '/vendor/settings', label: 'Settings' },
];

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isVendor, setIsVendor] = useState<boolean | null>(null);

  useEffect(() => {
    getMyVendor()
      .then((res) => {
        if ('hasVendor' in res) {
          router.replace('/become-vendor');
        } else {
          setIsVendor(true);
        }
      })
      .catch(() => router.replace('/become-vendor'));
  }, [router]);

  if (isVendor === null) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-forest-700/60">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-forest-900">
      <header className="sticky top-0 z-40 border-b border-cream-200 bg-cream-50/80 backdrop-blur dark:border-forest-700 dark:bg-forest-900/80">
        <Container size="xl">
          <div className="flex h-16 items-center justify-between">
            <Link href="/vendor"><Logo size="sm" /></Link>
            <Button variant="ghost" size="sm" onClick={async () => { await signOut(); router.replace('/signin'); }}>
              Sign out
            </Button>
          </div>
        </Container>
      </header>
      <Container size="xl">
        <div className="grid grid-cols-1 gap-6 py-6 lg:grid-cols-[200px_1fr]">
          <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1" aria-label="Vendor">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition whitespace-nowrap',
                  pathname === item.href
                    ? 'bg-forest-700 text-cream-100'
                    : 'text-forest-700 hover:bg-cream-200 dark:text-cream-100 dark:hover:bg-forest-800',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <main>{children}</main>
        </div>
      </Container>
    </div>
  );
}
