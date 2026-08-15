'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { consumeMagicLink } from '@/lib/auth-client';

export function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current) return;
    const token = searchParams.get('token');
    if (!token) {
      router.replace('/signin?error=missing-token');
      return;
    }
    attempted.current = true;
    consumeMagicLink(token)
      .then(() => {
        router.replace('/home');
      })
      .catch(() => {
        router.replace('/signin?error=invalid-token');
      });
  }, [router, searchParams]);

  return (
    <p className="text-sm text-forest-700/70 dark:text-cream-100/70">Signing you in…</p>
  );
}
