'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { SearchIcon, HeartIcon, CheckIcon, StarIcon, ArrowRightIcon } from '@/components/icons';

const TOUR = [
  { icon: <SearchIcon className="h-5 w-5" />, title: 'Browse', desc: 'Discover vendors by category on your campus.', href: '/browse' },
  { icon: <HeartIcon className="h-5 w-5" />, title: 'Wishlist', desc: 'Save vendors you love for later.', href: '/wishlist' },
  { icon: <CheckIcon className="h-5 w-5" />, title: 'Following', desc: 'Follow vendors for new listings.', href: '/following' },
  { icon: <StarIcon className="h-5 w-5" />, title: 'Profile', desc: 'Manage your account & campus.', href: '/profile' },
];

export function ShopperWelcomeOverlay({ firstName }: { firstName?: string }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [dismissing, setDismissing] = useState(false);

  const dismiss = async () => {
    setDismissing(true);
    try {
      await api('/api/users/me', {
        method: 'PATCH',
        body: JSON.stringify({ homeSeenAt: new Date().toISOString() }),
      });
      router.refresh();
    } finally {
      setDismissing(false);
    }
  };

  return (
    <Modal isOpen onClose={dismiss} title="Welcome to Voeq" closeOnBackdrop={false} hideCloseButton>
      <div className="px-6 py-6">
        {step === 0 ? (
          <>
            <h2 className="font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">
              You&apos;re in{firstName ? `, ${firstName}` : ''} 👋
            </h2>
            <p className="mt-2 text-sm text-forest-700/80 dark:text-cream-100/80">
              Here&apos;s your toolkit — a quick tour of what you can do on Voeq.
            </p>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {TOUR.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="flex items-start gap-3 rounded-2xl border border-cream-300 p-4 transition hover:border-gold-500/50 hover:shadow-md dark:border-forest-700 dark:border-cream-100"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-600 dark:text-gold-400">
                    {t.icon}
                  </span>
                  <span>
                    <span className="block font-medium text-forest-900 dark:text-cream-100">{t.title}</span>
                    <span className="block text-sm text-forest-700/60 dark:text-cream-100/60">{t.desc}</span>
                  </span>
                </Link>
              ))}
            </div>
          </>
        ) : null}
        <div className="mt-6 flex items-center justify-between border-t border-cream-200 pt-4 dark:border-forest-700">
          <button
            onClick={dismiss}
            disabled={dismissing}
            className="text-sm font-medium text-forest-700/60 hover:text-forest-900 dark:text-cream-100/60 dark:hover:text-cream-50"
          >
            Skip
          </button>
          <Button onClick={dismiss} isLoading={dismissing} variant="gold">
            Got it <CheckIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Modal>
  );
}
