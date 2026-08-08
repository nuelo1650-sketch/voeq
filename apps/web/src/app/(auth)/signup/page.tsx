'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUpWithPassword } from '@/lib/auth-client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">Create your account</h1>
        <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">Join Voeq with your campus email.</p>
      </div>

      {error && <p className="text-center text-sm text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
        <Input label="Campus email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
        <Input label="Confirm password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required autoComplete="new-password" />
        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="text-center text-sm text-forest-700/70 dark:text-cream-100/70">
        Already have an account? <a href="/signin" className="text-forest-900 underline">Sign in</a>
      </p>
    </div>
  );
}
