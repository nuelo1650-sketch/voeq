import { Suspense } from 'react';
import { OtpForm } from '@/components/auth/OtpForm';

export default function VerifyOtpPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">
          Check your email
        </h1>
        <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">
          Enter the verification code we sent you
        </p>
      </div>
      <Suspense fallback={<p>Loading…</p>}>
        <OtpForm />
      </Suspense>
    </div>
  );
}
