'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPassword, requestMagicLink } from '@/lib/auth-client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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

  if (magicSent) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">Check your email</h1>
          <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">We sent you a sign-in link. Click it to continue.</p>
          <p className="mt-2 text-xs text-forest-700/60">The link expires in 15 minutes and can only be used once.</p>
          <Button variant="ghost" className="mt-4" onClick={() => setMagicSent(false)}>Back to sign in</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">Sign in to Voeq</h1>
        <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">Use your campus email or magic link to continue.</p>
      </div>

      {error && <p className="text-center text-sm text-red-600">{error}</p>}

      <form onSubmit={handlePasswordSignIn} className="space-y-4">
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <form onSubmit={handleMagicLink} className="space-y-3">
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        <Button type="submit" variant="outline" fullWidth disabled={loading}>
          {loading ? 'Sending link…' : 'Send magic link'}
        </Button>
      </form>

      <p className="text-center text-sm text-forest-700/70 dark:text-cream-100/70">
        Don&apos;t have an account? <a href="/signup" className="text-forest-900 underline">Sign up</a>
      </p>
    </div>
  );
}
