'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthShell } from '@/components/auth/AuthShell';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { AuthDivider } from '@/components/auth/AuthDivider';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { signInWithGoogle } from '@/lib/auth-client';

function SignUpPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSuccess = (email: string, pendingToken: string) => {
    // Client-side transition to OTP — no full page reload (continuous flow).
    const params = new URLSearchParams({ email, pendingToken });
    router.push(`/verify-otp?${params.toString()}`);
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const intent = searchParams.get('intent') === 'vendor' ? 'vendor' : 'buyer';
      await signInWithGoogle(intent);
    } catch {
      setGoogleLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join Voeq and connect with verified campus vendors."
    >
      <div className="px-6 pb-6 pt-8 md:px-8 md:pb-8 md:pt-10">
        <div className="space-y-6">
          <GoogleButton isLoading={googleLoading} onClick={handleGoogle} />
          <AuthDivider />
          <SignUpForm onSuccess={handleSuccess} />
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

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <SignUpPageInner />
    </Suspense>
  );
}
