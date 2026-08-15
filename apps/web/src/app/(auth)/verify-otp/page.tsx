'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyOtp, resendOtp } from '@/lib/auth-client';
import { resolvePostAuthDestination } from '@/lib/auth-redirect';
import { Button } from '@/components/ui/Button';
import { AuthShell } from '@/components/auth/AuthShell';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

export default function VerifyOtpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [intent, setIntent] = useState<'buyer' | 'vendor'>('buyer');
  const [pendingToken, setPendingToken] = useState('');
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Read email + intent from the URL (?email=...&intent=...) on mount.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const e = params.get('email');
      if (e) setEmail(e);
      const i = params.get('intent');
      if (i === 'vendor' || i === 'buyer') setIntent(i);
      const pt = params.get('pendingToken');
      if (pt) setPendingToken(pt);
    }
  }, []);

  // Countdown timer for the resend button.
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const code = digits.join('');

  const handleChange = (index: number, value: string) => {
    // Keep only the last typed digit (numeric).
    const sanitized = value.replace(/\D/g, '');
    if (!sanitized) {
      // User deleted — clear this box.
      const next: string[] = [...digits];
      next[index] = '';
      setDigits(next);
      setError(null);
      return;
    }
    const char = sanitized[sanitized.length - 1] ?? '';
    const next: string[] = [...digits];
    next[index] = char;
    setDigits(next);
    setError(null);
    // Auto-advance to the next box.
    if (index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next: string[] = Array(OTP_LENGTH).fill('');
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i] ?? '';
    setDigits(next);
    setError(null);
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputsRef.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < OTP_LENGTH) {
      setError(`Please enter all ${OTP_LENGTH} digits`);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await verifyOtp({ email, otp: code, pendingToken });
      if (result.user) {
        setVerified(true);
        const dest = resolvePostAuthDestination(result.user);
        setTimeout(() => {
          window.location.replace(dest);
        }, 1200);
      }
    } catch (err: unknown) {
      const apiError = err as { error?: string; message?: string };
      setError(apiError.error || apiError.message || 'Invalid or expired code');
      // Clear the boxes so the user can retype.
      setDigits(Array(OTP_LENGTH).fill(''));
      inputsRef.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    if (!email) {
      setError('Enter your email above to resend the code');
      return;
    }
    setResending(true);
    setError(null);
    try {
      await resendOtp({ email, pendingToken });
      setCooldown(RESEND_SECONDS);
      setDigits(Array(OTP_LENGTH).fill(''));
      inputsRef.current[0]?.focus();
    } catch {
      setError('Could not resend code. Try again shortly.');
    } finally {
      setResending(false);
    }
  };

  if (verified) {
    return (
      <AuthShell title="Email verified" subtitle="Redirecting you to Voeq…">
        <div className="mx-auto flex w-full max-w-sm flex-col items-center space-y-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-700/10 dark:bg-cream-100/10 dark:bg-forest-900/10">
            <svg viewBox="0 0 24 24" className="h-7 w-7 text-forest-700 dark:text-cream-100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <p className="text-sm text-forest-700/70 dark:text-cream-100/70">Your email has been verified.</p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Check verification code"
      subtitle="We've sent a special code to your email. Type it here to sign in."
    >
      <div className="mx-auto w-full max-w-sm">
        {/* Envelope graphic with gradient glow */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-full bg-forest-500/30 blur-2xl" />
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cream-100 shadow-lg ring-1 ring-forest-700/10 dark:bg-forest-800 dark:ring-cream-100/10 dark:bg-forest-900">
              <svg viewBox="0 0 24 24" className="h-8 w-8 text-forest-700 dark:text-cream-100" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
            </div>
          </div>
        </div>

        <p className="mb-1 text-center text-sm text-forest-700/70 dark:text-cream-100/70">
          Code sent to
        </p>
        <input
          type="email"
          value={email}
          readOnly
          aria-readonly="true"
          placeholder="your@email.com"
          className="mb-6 w-full rounded-xl border border-cream-300 bg-cream-100/60 px-4 py-2.5 text-center text-sm text-forest-900 outline-none dark:border-forest-700 dark:bg-forest-900/60 dark:text-cream-100 dark:border-cream-100"
          aria-label="Email address"
        />

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <div className="pointer-events-none absolute inset-x-0 top-1/2 -z-0 h-px -translate-y-1/2 bg-gradient-to-r from-gold-500/0 via-gold-500/40 to-gold-500/0" aria-hidden="true" />
            <div className="relative flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputsRef.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete={i === 0 ? 'one-time-code' : 'off'}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onFocus={(e) => e.target.select()}
                  className="relative z-10 h-14 w-12 rounded-xl border border-cream-300 bg-cream-50 text-center text-2xl font-semibold text-forest-900 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/40 dark:border-forest-700 dark:bg-forest-800 dark:text-cream-100 sm:h-16 sm:w-14 sm:text-3xl dark:border-cream-100"
                  aria-label={`Digit ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {error && (
            <p className="text-center text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? 'Verifying…' : 'Verify email'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-forest-700/60 dark:text-cream-100/60">
            Didn&apos;t get the code?{' '}
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || resending}
              className="font-medium text-forest-700 underline-offset-2 transition hover:underline disabled:cursor-not-allowed disabled:text-forest-700/40 disabled:no-underline dark:text-cream-100 dark:disabled:text-cream-100/40 dark:text-cream-100/40"
            >
              {resending
                ? 'Sending…'
                : cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : 'Resend code'}
            </button>
          </p>
        </div>
      </div>
    </AuthShell>
  );
}
