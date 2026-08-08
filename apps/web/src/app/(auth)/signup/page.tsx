'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUpWithPassword, signInWithGoogle } from '@/lib/auth-client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { AuthDivider } from '@/components/auth/AuthDivider';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { motion } from 'framer-motion';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await signUpWithPassword({ email, name, password });
      router.push('/verify-otp?email=' + encodeURIComponent(email));
    } catch (err: unknown) {
      const apiError = err as { error?: string; message?: string };
      setError(apiError.error || apiError.message || 'Sign up failed');
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
    <div className="flex min-h-screen items-center justify-center bg-cream-50 px-4 dark:bg-forest-900">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <Card className="border-cream-200 bg-white/80 shadow-xl backdrop-blur dark:border-forest-700 dark:bg-forest-800/80">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-semibold">Create your account</CardTitle>
            <CardDescription>Join Voeq with your campus email or Google.</CardDescription>
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

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
                <Input
                  label="Campus email"
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
                  autoComplete="new-password"
                />
                <Input
                  label="Confirm password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <Button type="submit" variant="primary" fullWidth disabled={loading || googleLoading}>
                  {loading ? 'Creating account…' : 'Create account'}
                </Button>
              </form>
            </div>
          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-center text-sm text-forest-700/70 dark:text-cream-100/70">
              Already have an account?{' '}
              <a href="/signin" className="font-medium text-forest-900 underline underline-offset-2 hover:text-forest-700 dark:text-cream-100 dark:hover:text-gold-400">
                Sign in
              </a>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
