'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/chart-utils';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/institutions', label: 'Institutions', icon: '🏛️' },
  { href: '/admin/campuses', label: 'Campuses', icon: '📍' },
  { href: '/admin/categories', label: 'Categories', icon: '🏷️' },
  { href: '/admin/vendors', label: 'Vendors', icon: '🏪' },
  { href: '/admin/listings', label: 'Listings', icon: '📦' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
  { href: '/admin/reviews', label: 'Reviews', icon: '⭐' },
  { href: '/admin/reports', label: 'Reports', icon: '🚩' },
  { href: '/admin/featured', label: 'Featured', icon: '✨' },
  { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
  { href: '/admin/system', label: 'System', icon: '⚙️' },
  { href: '/admin/emails', label: 'Emails', icon: '📧' },
  { href: '/admin/features', label: 'Features', icon: '🚧' },
  { href: '/admin/audit', label: 'Audit Log', icon: '📜' },
  { href: '/admin/profile', label: 'Profile', icon: '👤' },
  { href: '/admin/settings', label: 'Settings', icon: '🔧' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex h-full w-56 flex-col gap-1 border-r border-cream-300 bg-cream-50 p-4 dark:border-forest-700 dark:bg-forest-900">
      <Link href="/admin" className="mb-4 font-serif text-lg font-semibold text-forest-900 dark:text-cream-100">
        Admin
      </Link>
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition',
              isActive
                ? 'bg-forest-700 text-cream-100'
                : 'text-forest-700 hover:bg-cream-200 dark:text-cream-100 dark:hover:bg-forest-800',
            )}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
