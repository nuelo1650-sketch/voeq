'use client';

import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/marketplace/ThemeToggle';

export function AuthShell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="relative w-full bg-cream-50 dark:bg-forest-900">
      {/* Desktop background shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl dark:bg-gold-500/15" />
        <div className="absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-forest-500/10 blur-3xl dark:bg-forest-400/10" />
      </div>

      <div className="relative mx-auto flex w-full max-w-5xl flex-col md:flex-row md:items-center md:justify-center md:gap-12 lg:gap-16">
        {/* Left brand column - desktop only */}
        <div className="hidden md:block md:w-[45%] lg:w-1/2">
          <div className="mb-6 flex items-center gap-3 lg:mb-8">
            <Logo size="lg" />
            <span className="text-xl font-semibold tracking-tight text-forest-900 dark:text-cream-100">Voeq</span>
          </div>
          <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100 lg:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 text-base text-forest-700/80 dark:text-cream-100/80 lg:mt-4 lg:text-lg">
              {subtitle}
            </p>
          )}
          <div className="mt-8 flex flex-col gap-3 lg:mt-10 lg:gap-4">
            <div className="flex items-center gap-3 text-sm text-forest-700/70 dark:text-cream-100/70">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-forest-700/10 text-xs font-semibold text-forest-900 dark:bg-cream-100/10 dark:text-cream-100 lg:h-8 lg:w-8">1</span>
              Discover verified vendors on your campus
            </div>
            <div className="flex items-center gap-3 text-sm text-forest-700/70 dark:text-cream-100/70">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-forest-700/10 text-xs font-semibold text-forest-900 dark:bg-cream-100/10 dark:text-cream-100 lg:h-8 lg:w-8">2</span>
              Browse listings with transparent pricing
            </div>
            <div className="flex items-center gap-3 text-sm text-forest-700/70 dark:text-cream-100/70">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-forest-700/10 text-xs font-semibold text-forest-900 dark:bg-cream-100/10 dark:text-cream-100 lg:h-8 lg:w-8">3</span>
              Connect directly via WhatsApp
            </div>
          </div>
          <p className="mt-8 text-xs text-forest-700/50 dark:text-cream-100/50 lg:mt-10">
            Trusted by students across Nigerian universities.
          </p>
        </div>

        {/* Right auth column */}
        <div className="w-full md:w-[55%] lg:w-1/2">
          <div className="mb-4 flex items-center justify-between md:hidden">
            <div className="flex items-center gap-2">
              <Logo size="lg" />
              <span className="text-lg font-semibold tracking-tight text-forest-900 dark:text-cream-100">Voeq</span>
            </div>
            <ThemeToggle />
          </div>
          <div className="overflow-hidden rounded-2xl border border-cream-300 bg-white/80 shadow-xl backdrop-blur transition dark:border-forest-700 dark:bg-forest-800/80 sm:rounded-3xl">
            {children}
          </div>
          <div className="mt-4 rounded-2xl border border-gold-500/30 bg-gold-500/5 px-4 py-3 text-center dark:border-gold-400/30 dark:bg-gold-400/5">
            <p className="text-sm text-forest-700/80 dark:text-cream-100/80">
              Are you a vendor?{' '}
              <a
                href="/become-vendor"
                className="font-semibold text-forest-900 underline underline-offset-2 transition hover:text-gold-600 dark:text-cream-100 dark:hover:text-gold-400"
              >
                List your business on Voeq
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
