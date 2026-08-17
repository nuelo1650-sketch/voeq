'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { ArrowRightIcon, CheckIcon, PlusIcon, ShareIcon, EyeIcon } from '@/components/icons';

interface VendorStep {
  icon: React.ReactNode;
  title: string;
  body: string;
  bullets?: string[];
  cta?: { label: string; href: string };
  ctaIsLink?: boolean;
}

const STEPS: VendorStep[] = [
  {
    icon: <EyeIcon className="h-6 w-6" />,
    title: "You're live! Here's your dashboard",
    body: 'This is mission control for your storefront. These numbers update as shoppers discover you.',
    bullets: [
      'Views — how many shoppers opened your storefront',
      'WhatsApp clicks — inquiries from interested buyers',
      'Active listings — what you have live right now',
      'Reviews — what customers are saying',
    ],
  },
  {
    icon: <PlusIcon className="h-6 w-6" />,
    title: 'Add your next listing',
    body: 'Vendors with more listings get more views. Add another item or service to grow your reach.',
    cta: { label: 'New listing', href: '/vendor/listings/new' },
  },
  {
    icon: <ShareIcon className="h-6 w-6" />,
    title: 'See how shoppers see you',
    body: 'Your public storefront is live. Take a look at exactly what buyers experience.',
    ctaIsLink: true,
  },
];

export function VendorWelcomeOverlay({ storefrontHref }: { storefrontHref: string }) {
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

  const current = STEPS[step]!;
  const isLast = step === STEPS.length - 1;

  return (
    <Modal isOpen onClose={dismiss} title="Welcome to Voeq" closeOnBackdrop={false} hideCloseButton>
      <div className="px-6 py-6">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-500/15 text-gold-600 dark:text-gold-400">
            {current.icon}
          </span>
          <div>
            <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">
              {current.title}
            </h2>
            <p className="text-xs text-forest-700/60 dark:text-cream-100/60">
              Step {step + 1} of {STEPS.length}
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm text-forest-700/80 dark:text-cream-100/80">{current.body}</p>

        {current.bullets && (
          <ul className="mt-4 space-y-2">
            {current.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-forest-700 dark:text-cream-100">
                <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-600 dark:text-gold-400" />
                {b}
              </li>
            ))}
          </ul>
        )}

        {current.cta && !current.ctaIsLink && (
          <div className="mt-5">
            <Button asChild variant="primary">
              <Link href={current.cta.href}>{current.cta.label}</Link>
            </Button>
          </div>
        )}

        {current.ctaIsLink && (
          <div className="mt-5">
            <Button asChild variant="primary">
              <Link href={storefrontHref} target="_blank">
                View storefront
              </Link>
            </Button>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-cream-200 pt-4 dark:border-forest-700">
          <button
            onClick={dismiss}
            disabled={dismissing}
            className="text-sm font-medium text-forest-700/60 hover:text-forest-900 dark:text-cream-100/60 dark:hover:text-cream-50"
          >
            Skip
          </button>
          {isLast ? (
            <Button onClick={dismiss} isLoading={dismissing} variant="gold">
              Got it <CheckIcon className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={() => setStep((s) => s + 1)} variant="gold">
              Next <ArrowRightIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
