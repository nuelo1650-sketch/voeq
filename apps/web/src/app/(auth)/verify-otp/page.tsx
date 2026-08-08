'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verifyOtp } from '@/lib/auth-client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function VerifyOtpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setEmail(params.get('email') || '');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await verifyOtp({ email, otp });
      if (result.user) {
        setVerified(true);
        setTimeout(() => {
          window.location.href = '/home';
        }, 1200);
      }
    } catch (err: unknown) {
      const apiError = err as { error?: string; message?: string };
      setError(apiError.error || apiError.message || 'Invalid or expired code');
    } finally {
      setLoading(false);
    }
  };

  if (verified) {
    return (
      <div className="space-y-6 text-center">
        <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">Email verified</h1>
        <p className="text-sm text-forest-700/70 dark:text-cream-100/70">Redirecting you to Voeq…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">Verify your email</h1>
        <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">Enter the OTP sent to {email || 'your campus email'}.</p>
      </div>

      {error && <p className="text-center text-sm text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="One-time code" value={otp} onChange={(e) => setOtp(e.target.value)} required autoComplete="one-time-code" />
        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          {loading ? 'Verifying…' : 'Verify email'}
        </Button>
      </form>
    </div>
  );
}
