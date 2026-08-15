'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { endImpersonation } from '@/lib/admin-client';
import { getMe } from '@/lib/auth-client';

export function ImpersonationBanner() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isImpersonating, setIsImpersonating] = useState(false);

  useEffect(() => {
    let active = true;
    getMe()
      .then((data) => {
        if (active) setIsImpersonating(Boolean((data as { impersonatedBy?: string | null }).impersonatedBy));
      })
      .catch(() => {
        if (active) setIsImpersonating(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleEnd = async () => {
    if (!confirm('End impersonation session?')) return;
    setLoading(true);
    try {
      await endImpersonation();
      setIsImpersonating(false);
      router.push('/admin');
    } catch (err) {
      console.error('Failed to end impersonation', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isImpersonating) return null;

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between gap-4 border-b-2 border-gold-500 bg-gold-500/10 px-6 py-3">
      <div className="flex items-center gap-2">
        <svg className="h-5 w-5 text-gold-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <span className="text-sm font-semibold text-forest-900 dark:text-cream-100">
          You&apos;re impersonating a user. All actions are logged.
        </span>
      </div>
      <button
        onClick={handleEnd}
        disabled={loading}
        className="rounded-full bg-gold-500 px-4 py-1.5 text-sm font-medium text-forest-900 hover:bg-gold-400 disabled:opacity-50"
      >
        {loading ? 'Ending…' : 'End session'}
      </button>
    </div>
  );
}
