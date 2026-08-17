'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMe } from '@/lib/auth-client';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { useStepSave } from '@/lib/useStepSave';
import { AuthError } from '@/components/auth/AuthError';

type Prefs = {
  emailMarketing: boolean;
  emailReviews: boolean;
  emailNewsletter: boolean;
  notifyNewListings: boolean;
  notifyNewReviews: boolean;
  notifyNewFollowers: boolean;
  notifyDisputes: boolean;
};

const DEFAULT_PREFS: Prefs = {
  emailMarketing: true,
  emailReviews: true,
  emailNewsletter: true,
  notifyNewListings: true,
  notifyNewReviews: true,
  notifyNewFollowers: true,
  notifyDisputes: true,
};

const PREF_GROUPS: Array<{ title: string; items: Array<{ key: keyof Prefs; label: string; desc: string }> }> = [
  {
    title: 'New activity',
    items: [
      { key: 'notifyNewListings', label: 'New listings from followed vendors', desc: 'When vendors you follow post something new.' },
      { key: 'notifyNewReviews', label: 'New reviews on your wishlist', desc: 'When items you saved get new reviews.' },
      { key: 'notifyNewFollowers', label: 'New followers', desc: 'When a vendor or shopper follows you.' },
    ],
  },
  {
    title: 'Email',
    items: [
      { key: 'emailNewsletter', label: 'Weekly campus digest', desc: 'A roundup of what is happening on your campus.' },
      { key: 'emailMarketing', label: 'Product & feature updates', desc: 'Occasional news about Voeq features.' },
      { key: 'emailReviews', label: 'Review reminders', desc: 'Nudges to review vendors you have ordered from.' },
    ],
  },
  {
    title: 'Account',
    items: [{ key: 'notifyDisputes', label: 'Dispute & order alerts', desc: 'Important updates about disputes or your orders.' }],
  },
];

export function ShopperOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [agreed, setAgreed] = useState(false);
  const [hasCampus, setHasCampus] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [loadError, setLoadError] = useState(false);
  const { status, error, save } = useStepSave();

  useEffect(() => {
    getMe()
      .then((data) => {
        setAgreed(!!data.user.agreementAcceptedAt);
        setHasCampus(!!data.user.defaultCampusId);
      })
      .catch(() => setLoadError(true));
  }, []);

  const savePrefs = () =>
    save(async () => {
      await api('/api/preferences/me', { method: 'PATCH', body: JSON.stringify(prefs) });
      router.push('/shopper/dashboard');
    });

  if (loadError) {
    return (
      <Container size="md">
        <div className="rounded-2xl border border-cream-300 bg-cream-50 p-8 text-center dark:border-forest-700 dark:bg-forest-800 dark:border-cream-100">
          <p className="text-sm text-forest-700/80 dark:text-cream-100/80">We couldn&apos;t load your profile. Check your connection and try again.</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container size="md">
      <div className="mx-auto max-w-xl py-10">
        <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">Welcome to Voeq</h1>
        <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">A few quick steps and your shopper profile is ready.</p>

        {/* Pill step indicator (1-2-3) */}
        <div className="mt-6 flex items-center gap-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className={`h-1.5 flex-1 rounded-full ${n <= step ? 'bg-gold-500' : 'bg-cream-200 dark:bg-forest-700'}`} />
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-cream-300 bg-cream-50 p-6 dark:border-forest-700 dark:bg-forest-800 dark:border-cream-100">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Agreement</h2>
              <p className="text-sm text-forest-700/70 dark:text-cream-100/70">
                {agreed ? 'You have accepted the Voeq terms.' : 'Please accept the Voeq user agreement to continue.'}
              </p>
              {!agreed && (
                <Button onClick={() => router.push('/shopper/onboarding?step=agreement')}>Review & accept</Button>
              )}
              <div className="flex justify-end">
                <Button disabled={!agreed} onClick={() => setStep(2)}>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Your campus</h2>
              <p className="text-sm text-forest-700/70 dark:text-cream-100/70">
                {hasCampus ? 'Your campus is set.' : 'Pick the campus you want to shop on.'}
              </p>
              {!hasCampus && <Button onClick={() => router.push('/select-campus')}>Select campus</Button>}
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button disabled={!hasCampus} onClick={() => setStep(3)}>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Feed preferences</h2>
              <p className="text-sm text-forest-700/70 dark:text-cream-100/70">Choose what you want to hear about. You can change these later.</p>
              <div className="space-y-5">
                {PREF_GROUPS.map((group) => (
                  <div key={group.title} className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">{group.title}</p>
                    {group.items.map((p) => (
                      <label key={p.key} className="flex cursor-pointer items-start gap-3 rounded-xl border border-cream-200 p-3 dark:border-forest-700 dark:border-cream-100/30">
                        <input
                          type="checkbox"
                          checked={prefs[p.key]}
                          onChange={(e) => setPrefs((prev) => ({ ...prev, [p.key]: e.target.checked }))}
                          className="mt-1 h-4 w-4"
                        />
                        <span>
                          <span className="block text-sm font-medium text-forest-900 dark:text-cream-100">{p.label}</span>
                          <span className="block text-xs text-forest-700/60 dark:text-cream-100/60">{p.desc}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                ))}
              </div>
              <AuthError>{error}</AuthError>
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button onClick={savePrefs} isLoading={status === 'saving'}>
                  Finish
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
