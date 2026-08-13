'use client';

import { type ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/marketplace/ThemeToggle';

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

export function AuthShell({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-cream-50 dark:bg-forest-900">
      {/* Layered brand background: forest depth + gold spotlight */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-900 via-forest-800 to-[#0a2b20] dark:from-forest-950 dark:via-forest-900 dark:to-[#061a13]" />
        <div className="absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-gold-500/10 blur-3xl dark:bg-gold-500/15" />
        <div className="absolute -right-24 top-1/4 h-[26rem] w-[26rem] rounded-full bg-forest-500/10 blur-3xl dark:bg-forest-400/10" />
        {/* faint grain via repeating radial dots */}
        <div
          className="absolute inset-0 opacity-[0.05] dark:opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(rgba(247,245,240,0.6) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-center md:gap-12 lg:gap-16">
        {/* Left brand column - desktop only */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="hidden md:block md:w-[45%] lg:w-1/2"
        >
          <motion.div variants={item} className="mb-6 flex items-center gap-3 lg:mb-8">
            <Logo size="lg" />
            <span className="text-xl font-semibold tracking-tight text-cream-100">Voeq</span>
            <ThemeToggle />
          </motion.div>
          <motion.h1
            variants={item}
            className="font-serif text-3xl font-semibold text-cream-100 lg:text-4xl"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              variants={item}
              className="mt-3 text-base text-cream-100/80 lg:mt-4 lg:text-lg"
            >
              {subtitle}
            </motion.p>
          )}
          <motion.div variants={item} className="mt-8 flex flex-col gap-3 lg:mt-10 lg:gap-4">
            {[
              'Discover verified vendors on your campus',
              'Browse listings with transparent pricing',
              'Connect directly via WhatsApp',
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-cream-100/70">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-500/15 text-xs font-semibold text-gold-500 lg:h-8 lg:w-8">
                  {i + 1}
                </span>
                {text}
              </div>
            ))}
          </motion.div>
          <motion.div variants={item} className="mt-8 lg:mt-10">
            <div className="h-px w-24 bg-gradient-to-r from-gold-500/70 to-transparent" />
            <p className="mt-4 text-xs text-cream-100/50">
              Trusted by students across Nigerian universities.
            </p>
          </motion.div>
        </motion.div>

        {/* Right auth column */}
        <motion.div
          variants={item}
          initial="hidden"
          animate="show"
          className="w-full md:w-[55%] lg:w-1/2"
        >
          {/* Mobile header */}
          <div className="mb-5 flex items-center justify-between md:hidden">
            <Link href="/" className="flex items-center gap-2" aria-label="Back to home">
              <Logo size="md" />
              <span className="text-lg font-semibold tracking-tight text-forest-900 dark:text-cream-100">
                Voeq
              </span>
            </Link>
            <ThemeToggle />
          </div>
          <div className="overflow-hidden rounded-2xl border border-cream-300/70 bg-white/85 shadow-2xl shadow-forest-900/10 backdrop-blur-xl transition dark:border-forest-700 dark:bg-forest-800/85 sm:rounded-3xl">
            <div className="h-1.5 w-full bg-gradient-to-r from-forest-700 via-gold-500 to-forest-700" />
            <div className="px-6 pb-6 pt-8 md:px-8 md:pb-8 md:pt-10">{children}</div>
          </div>
          <div className="mt-4 rounded-2xl border border-gold-500/40 bg-gold-500/[0.07] px-4 py-3 text-center shadow-[0_0_0_1px_rgba(212,175,55,0.06),0_8px_30px_-12px_rgba(212,175,55,0.35)] dark:border-gold-400/40 dark:bg-gold-400/[0.07]">
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
        </motion.div>
      </div>
    </div>
  );
}
