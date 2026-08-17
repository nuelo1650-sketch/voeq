'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { signUpWithPassword, getCurrentAgreements, formatAuthError } from '@/lib/auth-client';
import { SignupDisclaimerModal } from '@/components/auth/SignupDisclaimerModal';
import { AuthError } from '@/components/auth/AuthError';

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Za-z]/, 'Password must contain a letter')
    .regex(/[0-9]/, 'Password must contain a number'),
});

type SignupInput = z.infer<typeof signupSchema>;

const INTENTS: Array<{ value: 'buyer' | 'vendor'; label: string; sub: string }> = [
  { value: 'buyer', label: 'Student / Shopper', sub: 'Browse and connect with campus vendors' },
  { value: 'vendor', label: 'Vendor', sub: 'List your business and reach students' },
];

export function SignUpForm({ onSuccess }: { onSuccess?: (email: string, pendingToken: string) => void }) {
  const [intent, setIntent] = useState<'buyer' | 'vendor'>('buyer');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [agreementVersion, setAgreementVersion] = useState<string>('1.0');
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);

  useEffect(() => {
    getCurrentAgreements()
      .then((agreements) => {
        if (agreements?.tos?.version) setAgreementVersion(agreements.tos.version);
      })
      .catch(() => {
        /* keep default '1.0' */
      });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const pendingDraft = useRef<{ name: string; email: string; password: string; intent: 'buyer' | 'vendor'; agreementVersion: string } | null>(null);

  const onSubmit = async (data: SignupInput) => {
    // TOS acceptance is handled by the SignupDisclaimerModal gate; open it
    // instead of submitting directly.
    setSubmitError(null);
    pendingDraft.current = { ...data, intent, agreementVersion };
    setDisclaimerOpen(true);
  };

  const handleAccept = async () => {
    const draft = pendingDraft.current;
    if (!draft) return;
    try {
      const result = await signUpWithPassword({
        name: draft.name,
        email: draft.email,
        password: draft.password,
        agreedToTerms: true,
        agreementVersion: draft.agreementVersion,
        intent: draft.intent,
      });
      setDisclaimerOpen(false);
      onSuccess?.(draft.email, result.pendingToken);
    } catch (err) {
      setDisclaimerOpen(false);
      const error = err as { error?: string; message?: string };
      setSubmitError(formatAuthError(error));
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Role intent — visible toggle (default buyer) */}
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Account type">
          {INTENTS.map((opt) => {
            const active = intent === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setIntent(opt.value)}
                className={`rounded-xl border px-3 py-3 text-left transition ${
                  active
                    ? 'border-forest-700 bg-forest-700/5 ring-1 ring-forest-700 dark:border-gold-500 dark:bg-gold-500/10 dark:ring-gold-500'
                    : 'border-cream-300 bg-cream-50 hover:border-forest-700/40 dark:border-forest-700 dark:bg-forest-800 dark:hover:border-cream-100/40'
                }`}
              >
                <span className={`block text-sm font-semibold ${active ? 'text-forest-900 dark:text-cream-100' : 'text-forest-700 dark:text-cream-100/80'}`}>
                  {opt.label}
                </span>
                <span className="mt-0.5 block text-xs text-forest-700/60 dark:text-cream-100/60">{opt.sub}</span>
              </button>
            );
          })}
        </div>

        <Input
          label="Full name"
          type="text"
          autoComplete="name"
          placeholder="Your full name"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Campus email"
          type="email"
          autoComplete="email"
          placeholder="you@school.edu.ng"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          revealable
          autoComplete="new-password"
          placeholder="At least 8 characters"
          helperText="Must include a letter and a number"
          error={errors.password?.message}
          {...register('password')}
        />

        {submitError && <AuthError>{submitError}</AuthError>}
        <Button type="submit" isLoading={isSubmitting} fullWidth className="h-12">
          Create account
        </Button>
      </form>

      <SignupDisclaimerModal
        isOpen={disclaimerOpen}
        onClose={() => setDisclaimerOpen(false)}
        onAccept={handleAccept}
        userType={intent}
      />
    </>
  );
}
