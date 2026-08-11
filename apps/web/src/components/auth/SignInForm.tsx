'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { signInWithPassword, signInWithGoogle } from '@/lib/auth-client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthDivider } from '@/components/auth/AuthDivider';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export function SignInForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(searchParams.get('error') || null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch {
      setGoogleLoading(false);
    }
  };

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
        <div className="space-y-1.5">
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-forest-700/70 underline-offset-2 hover:text-forest-900 hover:underline dark:text-cream-100/70 dark:hover:text-cream-100"
            >
              Forgot password?
            </Link>
          </div>
        </div>
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
