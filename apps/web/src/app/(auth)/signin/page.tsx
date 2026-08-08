'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPassword, requestMagicLink, signInWithGoogle } from '@/lib/auth-client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { AuthDivider } from '@/components/auth/AuthDivider';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { motion } from 'framer-motion';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
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
        router.replace('/home');
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
      <div className="flex min-h-screen items-center justify-center bg-cream-50 px-4 dark:bg-forest-900">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              We sent you a sign-in link. Click it to continue.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-forest-700/60 dark:text-cream-100/60">
              The link expires in 15 minutes and can only be used once.
            </p>
            <Button variant="ghost" className="mt-6" onClick={() => setMagicSent(false)}>
              Back to sign in
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-50 px-4 dark:bg-forest-900">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <Card className="border-cream-200 bg-white/80 shadow-xl backdrop-blur dark:border-forest-700 dark:bg-forest-800/80">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-semibold">Sign in to Voeq</CardTitle>
            <CardDescription>
              Use your campus email, password, magic link, or Google.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200"
                >
                  {error}
                </motion.p>
              )}

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
                />
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <Button type="submit" variant="primary" fullWidth disabled={loading || googleLoading}>
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
                />
                <Button
                  type="submit"
                  variant="secondary"
                  fullWidth
                  disabled={loading || googleLoading}
                >
                  {loading ? 'Sending link…' : 'Send magic link'}
                </Button>
              </form>
            </div>
          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-center text-sm text-forest-700/70 dark:text-cream-100/70">
              Don&apos;t have an account?{' '}
              <a href="/signup" className="font-medium text-forest-900 underline underline-offset-2 hover:text-forest-700 dark:text-cream-100 dark:hover:text-gold-400">
                Sign up
              </a>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
