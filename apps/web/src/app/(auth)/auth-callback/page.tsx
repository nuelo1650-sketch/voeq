'use client';

import { useEffect, useState } from 'react';
import { consumeMagicLink } from '@/lib/auth-client';
import { resolvePostAuthDestination } from '@/lib/auth-redirect';

export const dynamic = 'force-dynamic';

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Signing you in…');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Invalid sign-in link.');
      return;
    }

    consumeMagicLink(token)
      .then((res) => {
        setStatus('success');
        setMessage('Signed in successfully. Redirecting…');
        const dest = resolvePostAuthDestination(res.user);
        setTimeout(() => {
          window.location.replace(dest);
        }, 1200);
      })
      .catch(() => {
        setStatus('error');
        setMessage('This link is invalid or expired.');
      });
  }, []);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        {status === 'loading' && (
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-cream-300 border-t-forest-700 dark:border-forest-700 dark:border-t-cream-100" />
        )}
        <p className={`text-sm ${status === 'error' ? 'text-red-600' : 'text-forest-700/70'}`}>{message}</p>
        {status === 'error' && (
          <a href="/signin" className="mt-4 inline-block text-sm text-forest-900 underline">Back to sign in</a>
        )}
      </div>
    </div>
  );
}
