'use client';

import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/marketplace/ThemeToggle';

export function AuthShell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="relative min-h-screen bg-cream-50 dark:bg-forest-900">
      {/* Desktop background shape */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl dark:bg-gold-500/15" />
        <div className="absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-forest-500/10 blur-3xl dark:bg-forest-400/10" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 md:flex-row md:items-center md:justify-center md:gap-16">
        {/* Left brand column */}
        <div className="hidden md:block md:w-1/2">
          <div className="mb-8 flex items-center gap-3">
            <Logo size="sm" />
            <span className="text-lg font-semibold tracking-tight text-forest-900 dark:text-cream-100">Voeq</span>
          </div>
          <h1 className="font-serif text-4xl font-semibold text-forest-900 dark:text-cream-100">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 text-lg text-forest-700/80 dark:text-cream-100/80">
              {subtitle}
            </p>
          )}
          <div className="mt-10 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-sm text-forest-700/70 dark:text-cream-100/70">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-700/10 text-xs font-semibold text-forest-900 dark:bg-cream-100/10 dark:text-cream-100">1</span>
              Discover verified vendors on your campus
            </div>
            <div className="flex items-center gap-3 text-sm text-forest-700/70 dark:text-cream-100/70">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-700/10 text-xs font-semibold text-forest-900 dark:bg-cream-100/10 dark:text-cream-100">2</span>
              Browse listings with transparent pricing
            </div>
            <div className="flex items-center gap-3 text-sm text-forest-700/70 dark:text-cream-100/70">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-700/10 text-xs font-semibold text-forest-900 dark:bg-cream-100/10 dark:text-cream-100">3</span>
              Connect directly via WhatsApp
            </div>
          </div>
          <p className="mt-10 text-xs text-forest-700/50 dark:text-cream-100/50">
            Trusted by students across Nigerian universities.
          </p>
        </div>

        {/* Right auth column */}
        <div className="w-full md:w-1/2">
          <div className="mb-6 flex items-center justify-between md:hidden">
            <Logo size="sm" />
            <ThemeToggle />
          </div>
          <div className="overflow-hidden rounded-3xl border border-cream-300 bg-white/80 shadow-xl backdrop-blur transition dark:border-forest-700 dark:bg-forest-800/80">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
