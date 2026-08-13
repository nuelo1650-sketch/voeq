'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthShell } from '@/components/auth/AuthShell';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { AuthDivider } from '@/components/auth/AuthDivider';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { signInWithGoogle } from '@/lib/auth-client';
import { motion } from 'framer-motion';

type Intent = 'buyer' | 'vendor';

export default function SignUpPage() {
  const router = useRouter();
  const [intent, setIntent] = useState<Intent>('buyer');
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSuccess = (email: string) => {
    router.push(`/verify-otp?email=${encodeURIComponent(email)}&intent=${intent}`);
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle(intent);
    } catch {
      setGoogleLoading(false);
    }
  };

  const cardBase =
    'flex flex-col items-start rounded-2xl border p-4 text-left transition';
  const card = (active: boolean) =>
    `${cardBase} ${
      active
        ? 'border-forest-700 bg-forest-700/5 shadow-sm dark:border-cream-100/40 dark:bg-cream-100/5'
        : 'border-cream-300 hover:border-forest-700/40 dark:border-forest-700'
    }`;

  return (
    <AuthShell
      title="Create your account"
      subtitle="Be one of the first to try Voeq at NMU."
    >
      <div className="px-6 pb-6 pt-8 md:px-8 md:pb-8 md:pt-10">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setIntent('buyer')}
              aria-pressed={intent === 'buyer'}
              className={card(intent === 'buyer')}
            >
              <span className="text-sm font-semibold text-forest-900 dark:text-cream-100">
                I&apos;m a Shopper
              </span>
              <span className="mt-1 text-xs text-forest-700/70 dark:text-cream-100/70">
                Browse &amp; chat with vendors
              </span>
            </button>
            <button
              type="button"
              onClick={() => setIntent('vendor')}
              aria-pressed={intent === 'vendor'}
              className={card(intent === 'vendor')}
            >
              <span className="text-sm font-semibold text-forest-900 dark:text-cream-100">
                I&apos;m a vendor
              </span>
              <span className="mt-1 text-xs text-forest-700/70 dark:text-cream-100/70">
                List my business
              </span>
            </button>
          </div>

          <GoogleButton isLoading={googleLoading} onClick={handleGoogle} />
          <AuthDivider />
          <SignUpForm onSuccess={handleSuccess} intent={intent} />
          <p className="text-center text-sm text-forest-700/70 dark:text-cream-100/70">
            Already have an account?{' '}
            <a
              href="/signin"
              className="font-medium text-forest-900 underline underline-offset-2 transition hover:text-gold-600 dark:text-cream-100 dark:hover:text-gold-400"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </AuthShell>
  );
}
