'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, LayoutDashboard, Users, Store, ListTree, Star, Flag, Building2, Tags, BarChart3, ScrollText, Mail, Settings, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/marketplace/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { signOut } from '@/lib/auth-client';

const ADMIN_NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/vendors', label: 'Vendors', icon: Store },
  { href: '/admin/listings', label: 'Listings', icon: ListTree },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/reports', label: 'Reports', icon: Flag },
  { href: '/admin/institutions', label: 'Institutions', icon: Building2 },
  { href: '/admin/categories', label: 'Categories', icon: Tags },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/audit', label: 'Audit log', icon: ScrollText },
  { href: '/admin/emails', label: 'Emails', icon: Mail },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const handleSignOut = async () => {
    await signOut();
    router.replace('/signin');
  };
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-cream-200 bg-cream-50/95 backdrop-blur dark:border-forest-700 dark:bg-forest-900/95 md:flex">
      <div className="flex h-16 items-center px-5">
        <Link href="/admin" aria-label="Voeq admin" className="transition-opacity hover:opacity-80">
          <Logo size="lg" />
        </Link>
      </div>
      <div className="px-5 pb-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500/15 px-2.5 py-1 text-xs font-medium text-gold-600 dark:text-gold-400">
          <ShieldCheck className="h-3.5 w-3.5" /> Super admin
        </span>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {ADMIN_NAV.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                active
                  ? 'bg-gold-500/15 text-forest-900 dark:text-cream-100'
                  : 'text-forest-700 hover:bg-cream-200 hover:text-forest-900 dark:text-cream-100/80 dark:hover:bg-forest-800',
              )}
            >
              {active && (
                <span className="absolute inset-y-2 left-0 w-1 rounded-full bg-gold-500" aria-hidden />
              )}
              <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition', active ? 'bg-gold-500 text-forest-900' : 'bg-cream-200/60 text-forest-700/80 group-hover:bg-cream-200 dark:bg-forest-800 dark:text-cream-100/80')}>
                <Icon className="h-5 w-5" />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-2 border-t border-cream-200 p-3 dark:border-forest-700">
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" className="flex-1" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
        <Link href="/home" className="block px-1 text-center text-xs text-forest-700/60 hover:text-gold-600 dark:text-cream-100/60">
          ← Back to marketplace
        </Link>
      </div>
    </aside>
  );
}
