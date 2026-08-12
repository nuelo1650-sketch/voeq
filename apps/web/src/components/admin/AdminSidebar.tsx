'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const I = (d: string) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

const ICONS: Record<string, React.ReactNode> = {
  dashboard: I('M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z'),
  institutions: I('M3 21h18M5 21V7l7-4 7 4v14M9 9h0M15 9h0M9 13h0M15 13h0'),
  campuses: I('M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11z M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'),
  categories: I('M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z'),
  vendors: I('M3 9l1-5h16l1 5M4 9h16v11H4zM9 9v11M15 9v11M3 13h18'),
  listings: I('M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4 9-4V7'),
  users: I('M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11'),
  reviews: I('M12 2l3 6 6 .9-4.5 4.4.9 6.7L12 17l-5.5 2 1-6.7L3 8.9 9 8z'),
  reports: I('M4 21V4h12l-2 3h6v14H4zM8 8v9M12 8v9'),
  featured: I('M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L3.2 7.7l5.4-.8z'),
  analytics: I('M3 3v18h18M7 16l4-5 3 3 5-7'),
  system: I('M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM3 12h2M19 12h2M12 3v2M12 19v2'),
  emails: I('M3 7l9 6 9-6M3 7h18v10H3z'),
  features: I('M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z'),
  audit: I('M6 3h9l5 5v13H6zM14 3v5h5M9 12h6M9 16h6'),
  profile: I('M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2'),
  settings: I('M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.4 1a7 7 0 0 0-1.7-1L15 2h-4l-.8 2.5a7 7 0 0 0-1.7 1l-2.4-1-2 3.5 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.5 2.4-1a7 7 0 0 0 1.7 1L11 22h4l.8-2.5a7 7 0 0 0 1.7-1l2.4 1 2-3.5-2-1.5a7 7 0 0 0 .1-1z'),
};

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
  { href: '/admin/institutions', label: 'Institutions', icon: 'institutions' },
  { href: '/admin/campuses', label: 'Campuses', icon: 'campuses' },
  { href: '/admin/categories', label: 'Categories', icon: 'categories' },
  { href: '/admin/vendors', label: 'Vendors', icon: 'vendors' },
  { href: '/admin/listings', label: 'Listings', icon: 'listings' },
  { href: '/admin/users', label: 'Users', icon: 'users' },
  { href: '/admin/reviews', label: 'Reviews', icon: 'reviews' },
  { href: '/admin/reports', label: 'Reports', icon: 'reports' },
  { href: '/admin/featured', label: 'Featured', icon: 'featured' },
  { href: '/admin/analytics', label: 'Analytics', icon: 'analytics' },
  { href: '/admin/system', label: 'System', icon: 'system' },
  { href: '/admin/emails', label: 'Emails', icon: 'emails' },
  { href: '/admin/features', label: 'Features', icon: 'features' },
  { href: '/admin/audit', label: 'Audit Log', icon: 'audit' },
  { href: '/admin/profile', label: 'Profile', icon: 'profile' },
  { href: '/admin/settings', label: 'Settings', icon: 'settings' },
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
            <span className="text-current">{ICONS[item.icon]}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
