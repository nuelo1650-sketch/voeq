'use client';

import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { ThemeToggle } from '@/components/marketplace/ThemeToggle';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-cream-200 bg-cream-50/80 backdrop-blur dark:border-forest-700 dark:bg-forest-900/80 dark:bg-forest-800/80 dark:border-cream-100">
        <Container size="lg">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" aria-label="Voeq home" className="flex items-center">
              <Logo size="lg" />
            </Link>
            <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
              <a href="/browse" className="text-sm font-medium text-forest-700 hover:text-forest-900 dark:text-cream-100 dark:hover:text-white">Browse</a>
              <a href="/for-vendors" className="text-sm font-medium text-forest-700 hover:text-forest-900 dark:text-cream-100 dark:hover:text-white">For Vendors</a>
              <a href="/about" className="text-sm font-medium text-forest-700 hover:text-forest-900 dark:text-cream-100 dark:hover:text-white">How it works</a>
            </nav>
            <details className="group relative md:hidden">
              <summary className="flex list-none items-center gap-2 rounded-md p-2 text-forest-700 hover:bg-cream-200 dark:text-cream-100 dark:hover:bg-forest-800 dark:bg-forest-700" aria-label="Open menu">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </summary>
              <div className="absolute right-0 z-50 mt-2 w-48 space-y-1 rounded-2xl border border-cream-200 bg-cream-50 p-3 shadow-xl dark:border-forest-700 dark:bg-forest-800 dark:border-cream-100">
                <a href="/browse" className="block rounded-md px-3 py-2 text-sm font-medium text-forest-700 hover:bg-cream-200 dark:text-cream-100 dark:hover:bg-forest-700">Browse</a>
                <a href="/for-vendors" className="block rounded-md px-3 py-2 text-sm font-medium text-forest-700 hover:bg-cream-200 dark:text-cream-100 dark:hover:bg-forest-700">For Vendors</a>
                <a href="/about" className="block rounded-md px-3 py-2 text-sm font-medium text-forest-700 hover:bg-cream-200 dark:text-cream-100 dark:hover:bg-forest-700">How it works</a>
                <a href="/signin" className="block rounded-md px-3 py-2 text-sm font-medium text-forest-700 hover:bg-cream-200 dark:text-cream-100 dark:hover:bg-forest-700">Sign in</a>
                <a href="/signup" className="block rounded-md px-3 py-2 text-sm font-medium text-forest-700 hover:bg-cream-200 dark:text-cream-100 dark:hover:bg-forest-700">Sign up</a>
              </div>
            </details>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="sm" asChild>
                <Link href="/signin">Sign in</Link>
              </Button>
              <Button variant="primary" size="sm" asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          </div>
        </Container>
      </header>
      <main>{children}</main>
      <footer className="border-t border-cream-200 bg-forest-900 py-12 text-cream-100 dark:border-forest-700 dark:border-cream-100">
        <Container size="lg">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
            <div>
              <Link href="/" aria-label="Voeq home">
                <Logo size="lg" tone="light" />
              </Link>
              <p className="mt-4 text-sm text-cream-100/70">The campus marketplace for Nigerian students.</p>
              <p className="mt-2 text-sm text-cream-100/70">Built by students, for students.</p>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-cream-100">Product</h3>
              <ul className="space-y-2 text-sm text-cream-100/70">
                <li><a href="/browse" className="hover:text-gold-500">Browse vendors</a></li>
                <li><a href="/search" className="hover:text-gold-500">Search</a></li>
                <li><a href="/for-vendors" className="hover:text-gold-500">For vendors</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-cream-100">Company</h3>
              <ul className="space-y-2 text-sm text-cream-100/70">
                <li><a href="/about" className="hover:text-gold-500">About</a></li>
                <li><a href="mailto:hello@voeq.ng" className="hover:text-gold-500">Contact</a></li>
                <li><a href="mailto:support@voeq.ng" className="hover:text-gold-500">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-cream-100">Legal</h3>
              <ul className="space-y-2 text-sm text-cream-100/70">
                <li><a href="/terms" className="hover:text-gold-500">Terms of Service</a></li>
                <li><a href="/privacy" className="hover:text-gold-500">Privacy Policy</a></li>
                <li><a href="/vendor-agreement" className="hover:text-gold-500">Vendor Agreement</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-cream-100">Social</h3>
              <ul className="space-y-2 text-sm text-cream-100/70">
                <li>
                  <a
                    href="https://instagram.com/voeq.ng"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 hover:text-gold-500"
                    aria-label="Voeq on Instagram"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.053.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                    <span>Instagram</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://tiktok.com/@voeq.ng"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 hover:text-gold-500"
                    aria-label="Voeq on TikTok"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.84a8.16 8.16 0 0 0 4.77 1.52V6.93a4.85 4.85 0 0 1-1-.24z" />
                    </svg>
                    <span>TikTok</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com/voeqng"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 hover:text-gold-500"
                    aria-label="Voeq on Twitter"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span>Twitter / X</span>
                  </a>
                </li>
                <li>
                  {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ? (
                    <a
                      href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 hover:text-gold-500"
                      aria-label="Voeq WhatsApp Business"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488" />
                      </svg>
                      <span>WhatsApp</span>
                    </a>
                  ) : null}
                </li>
              </ul>
            </div>
          </div>

          {/* Powered by Legacy LM */}
          <div className="mt-8 flex flex-col items-center justify-center gap-2 border-t border-forest-700 pt-6 sm:flex-row sm:gap-3 dark:border-cream-100">
            <span className="text-xs uppercase tracking-widest text-cream-100/50">
              Powered by
            </span>
            <a
              href="#"
              target="_blank"
              rel="noreferrer noopener"
              className="group inline-flex items-center gap-2 transition hover:opacity-80"
              aria-label="Legacy LM"
            >
              <span className="font-serif text-base font-semibold tracking-wide text-cream-100">
                Legacy
              </span>
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-gold-500 to-gold-600 text-xs font-bold text-forest-900 ring-1 ring-gold-400/30 transition group-hover:ring-gold-400/60 dark:text-cream-100">
                LM
              </span>
            </a>
          </div>

          <div className="mt-6 border-t border-forest-700 pt-6 dark:border-cream-100">
            <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
              <p className="text-sm text-cream-100/50">
                © 2026 Voeq Limited. All rights reserved.
              </p>
              <p className="text-sm text-cream-100/50">
                Pronounced <span className="font-semibold text-gold-500">/voʊk/</span> — like Vogue
              </p>
            </div>
          </div>
        </Container>
      </footer>
    </>
  );
}
