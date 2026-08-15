'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MoreHorizontal } from 'lucide-react';
import { NAV_ITEMS } from './nav-config';

export function AppBottomNav() {
  const pathname = usePathname();

  // Hide the buyer bottom nav while a vendor is still onboarding
  // (they aren't live yet and shouldn't see the shopper navigation).
  if (pathname.startsWith('/vendor/onboarding')) return null;

  const primary = NAV_ITEMS.filter((i) => i.primary).slice(0, 4);

  const isActive = (href: string) =>
    pathname === href || (href !== '/home' && pathname.startsWith(href));

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-cream-200 bg-cream-50/95 backdrop-blur dark:border-forest-700 dark:bg-forest-900/95 md:hidden dark:bg-forest-800/95 dark:border-cream-100">
      {primary.map((item) => {
        const active = isActive(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium transition ${
              active
                ? 'text-gold-600 dark:text-gold-500'
                : 'text-forest-700/70 dark:text-cream-100/60'
            } dark:text-cream-100/70`}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
      <Link
        href="/settings"
        className="flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium text-forest-700/70 dark:text-cream-100/60 dark:text-cream-100/70"
      >
        <MoreHorizontal className="h-5 w-5" />
        <span>More</span>
      </Link>
    </nav>
  );
}
