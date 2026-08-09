'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { signInWithPassword, requestMagicLink, signInWithGoogle } from '@/lib/auth-client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthDivider } from '@/components/auth/AuthDivider';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { motion, AnimatePresence } from 'framer-motion';

export function SignInForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(searchParams.get('error') || null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPassword({ email, password });
      if (result.user) {
        window.location.replace('/home');
      }
    } catch (err: unknown) {
      const apiError = err as { error?: string; message?: string };
      setError(apiError.error || apiError.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await requestMagicLink({ email });
      setMagicSent(true);
    } catch (err: unknown) {
      const apiError = err as { error?: string; message?: string };
      setError(apiError.error || apiError.message || 'Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch {
      setGoogleLoading(false);
    }
  };

  if (magicSent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h2 className="font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">Check your email</h2>
          <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">
            We sent you a sign-in link. Click it to continue.
          </p>
          <p className="mt-2 text-xs text-forest-700/60 dark:text-cream-100/60">
            The link expires in 15 minutes and can only be used once.
          </p>
        </div>
        <Button variant="secondary" fullWidth onClick={() => setMagicSent(false)}>
          Back to sign in
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="signin-error"
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="overflow-hidden rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200"
            role="alert"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <GoogleButton isLoading={googleLoading} onClick={handleGoogle} />
      <AuthDivider />

      <form onSubmit={handlePasswordSignIn} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="you@university.edu.ng"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          helperText={error ? undefined : 'Use the password you created during signup.'}
        />
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={loading || googleLoading}
          className="h-12"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <AuthDivider />

      <form onSubmit={handleMagicLink} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="you@university.edu.ng"
        />
        <Button
          type="submit"
          variant="secondary"
          fullWidth
          disabled={loading || googleLoading}
          className="h-12"
        >
          {loading ? 'Sending link…' : 'Send magic link'}
        </Button>
        <p className="text-center text-xs text-forest-700/60 dark:text-cream-100/60">
          No password? We&apos;ll send you a secure sign-in link.
        </p>
      </form>

      <p className="text-center text-sm text-forest-700/70 dark:text-cream-100/70">
        Don&apos;t have an account?{' '}
        <a
          href="/signup"
          className="font-medium text-forest-900 underline underline-offset-2 transition hover:text-gold-600 dark:text-cream-100 dark:hover:text-gold-400"
        >
          Sign up
        </a>
      </p>
    </div>
  );
}
