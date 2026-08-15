'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PanelLeftClose, PanelLeftOpen, LogOut } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/marketplace/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { NAV_ITEMS, BECOME_VENDOR } from './nav-config';

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onSignOut: () => void;
}

export function AppSidebar({ collapsed, onToggle, onSignOut }: AppSidebarProps) {
  const pathname = usePathname();

  // Buyers' shopper nav must not render inside vendor sections — a vendor sees
  // only the vendor chrome. Buyers never visit /vendor/*, so this is always safe.
  if (pathname.startsWith('/vendor')) return null;

  const isActive = (href: string) =>
    pathname === href || (href !== '/home' && pathname.startsWith(href));

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-cream-200 bg-cream-50/95 backdrop-blur dark:border-forest-700 dark:bg-forest-900/95 md:flex ${
        collapsed ? 'w-[76px]' : 'w-64'
      } transition-[width] duration-200 dark:bg-forest-800/95 dark:border-cream-100`}
    >
      <div className="flex h-16 items-center px-4">
        <Link href="/home" aria-label="Voeq home" className={collapsed ? 'mx-auto' : ''}>
          {collapsed ? <Logo size="sm" /> : <Logo size="lg" />}
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? 'bg-gold-500/15 text-forest-900 dark:text-cream-100'
                  : 'text-forest-700 hover:bg-cream-200 hover:text-forest-900 dark:text-cream-100/80 dark:hover:bg-forest-800'
              } dark:bg-forest-700`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  active ? 'bg-gold-500 text-forest-900' : 'bg-cream-200/60 dark:bg-forest-800'
                } dark:text-cream-100 dark:bg-forest-700/60`}
              >
                <Icon className="h-5 w-5" />
              </span>
              {!collapsed && <span className="truncate">{item.label}</span>}
              {active && !collapsed && (
                <span className="ml-auto h-2 w-2 rounded-full bg-gold-500" aria-hidden />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-cream-200 p-3 dark:border-forest-700 dark:border-cream-100">
        <Link
          href={BECOME_VENDOR.href}
          title={collapsed ? BECOME_VENDOR.label : undefined}
          className={`flex items-center gap-3 rounded-xl bg-gold-500 px-3 py-2.5 text-sm font-semibold text-forest-900 shadow-sm shadow-gold-500/30 transition hover:bg-gold-400 ${
            collapsed ? 'justify-center' : ''
          } dark:text-cream-100`}
        >
          <BECOME_VENDOR.icon className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="truncate">{BECOME_VENDOR.label}</span>}
        </Link>

        <div className={`flex items-center gap-2 ${collapsed ? 'flex-col' : ''}`}>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={onSignOut}
            className={collapsed ? 'px-2' : 'flex-1'}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Sign out</span>}
          </Button>
        </div>

        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-forest-700/70 hover:bg-cream-200 dark:text-cream-100/60 dark:hover:bg-forest-800 dark:text-cream-100/70 dark:bg-forest-700"
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
