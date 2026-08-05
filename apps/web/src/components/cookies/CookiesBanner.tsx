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
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, []);

  const handleAcceptAll = () => {
    setConsent({ analytics: true, marketing: true });
    setShow(false);
    window.location.reload();
  };

  const handleRejectAll = () => {
    setConsent({ analytics: false, marketing: false });
    setShow(false);
  };

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-forest-700 bg-cream-50 p-4 shadow-2xl dark:border-gold-500 dark:bg-forest-800 sm:p-6"
            role="dialog"
            aria-label="Cookie consent"
          >
            <div className="mx-auto max-w-6xl">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <h2 className="font-serif text-lg font-semibold text-forest-900 dark:text-cream-100">
                    We value your privacy
                  </h2>
                  <p className="mt-1 text-sm text-forest-700/80 dark:text-cream-100/80">
                    Voeq uses cookies to enhance your experience, analyze site traffic, and improve our services. We use essential cookies for authentication and security. With your consent, we also use analytics cookies to understand how you use Voeq. You can manage your preferences anytime.{' '}
                    <Link href="/privacy" className="font-medium text-forest-700 underline dark:text-gold-500">
                      Read our privacy policy
                    </Link>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setShowPreferences(true)}>
                    Customize
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
      </AnimatePresence>

      {showPreferences && (
        <CookiesPreferences onClose={() => setShowPreferences(false)} />
      )}
    </>
  );
}
