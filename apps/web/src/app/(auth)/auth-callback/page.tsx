import { Suspense } from 'react';
import { AuthCallbackContent } from '@/components/auth/AuthCallbackContent';

export const dynamic = 'force-dynamic';

export default function AuthCallbackPage() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Suspense fallback={<p className="text-sm text-forest-700/70">Signing you in…</p>}>
        <AuthCallbackContent />
      </Suspense>
    </div>
  );
}
