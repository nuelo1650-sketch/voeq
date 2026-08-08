'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { setConsent, getConsent } from './cookies';
import { CookiesPreferences } from './CookiesPreferences';

export function CookiesBanner() {
  const [show, setShow] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    const consent = getConsent();
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 800);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, []);

  const handleAcceptAll = () => {
    setConsent({ analytics: true, marketing: true });
    setShow(false);
  };

  const handleRejectAll = () => {
    setConsent({ analytics: false, marketing: false });
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-cream-300 bg-cream-50/95 p-4 shadow-2xl backdrop-blur-md dark:border-forest-700 dark:bg-forest-900/95 sm:p-6"
          role="dialog"
          aria-label="Cookie consent"
        >
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-gold-500" aria-hidden="true" />
                  <h2 className="font-serif text-lg font-semibold text-forest-900 dark:text-cream-100">
                    Your privacy, your choice
                  </h2>
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-forest-700/80 dark:text-cream-100/80">
                  Voeq uses essential cookies to keep you signed in and secure. With your permission, we also use analytics
                  cookies to improve the experience. No tracking without consent.{' '}
                  <Link href="/privacy" className="font-medium text-forest-900 underline dark:text-gold-500">
                    Read our privacy policy
                  </Link>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowPreferences(true)}>
                  Manage preferences
                </Button>
                <Button variant="secondary" size="sm" onClick={handleRejectAll}>
                  Reject all
                </Button>
                <Button variant="primary" size="sm" onClick={handleAcceptAll}>
                  Accept all
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {showPreferences && (
        <CookiesPreferences onClose={() => setShowPreferences(false)} />
      )}
    </AnimatePresence>
  );
}
