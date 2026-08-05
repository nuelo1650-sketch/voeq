'use client';

import { useState } from 'react';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { AuthDivider } from '@/components/auth/AuthDivider';
import { SignInForm } from '@/components/auth/SignInForm';
import { MagicLinkForm } from '@/components/auth/MagicLinkForm';
import { MethodSwitcher } from '@/components/auth/MethodSwitcher';

export default function SignInPage() {
  const [method, setMethod] = useState<'password' | 'magic'>('password');

  const handleGoogle = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">
          Sign in to find vendors on your campus
        </p>
      </div>

      <GoogleButton onClick={handleGoogle} />
      <AuthDivider />

      {method === 'password' ? (
        <>
          <SignInForm />
          <div className="text-center">
            <button
              type="button"
              onClick={() => setMethod('magic')}
              className="text-sm font-medium text-forest-700 underline-offset-2 hover:underline dark:text-gold-500"
            >
              Sign in with a link instead
            </button>
          </div>
        </>
      ) : (
        <>
          <MagicLinkForm />
          <div className="text-center">
            <button
              type="button"
              onClick={() => setMethod('password')}
              className="text-sm font-medium text-forest-700 underline-offset-2 hover:underline dark:text-gold-500"
            >
              Sign in with password instead
            </button>
          </div>
        </>
      )}

      <MethodSwitcher type="signin" currentMethod={method} />
    </div>
  );
}
