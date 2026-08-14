'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';

interface AdminActionProps {
  method?: 'POST' | 'DELETE' | 'PATCH';
  path: string;
  body?: Record<string, unknown>;
  confirmMessage?: string;
  label: string;
  loadingLabel?: string;
  variant?: 'primary' | 'ghost' | 'destructive' | 'gold' | 'outline';
  size?: 'sm' | 'md';
  onDone?: () => void;
}

export function AdminAction({ method = 'POST', path, body, confirmMessage, label, loadingLabel = 'Working…', variant = 'ghost', size = 'sm', onDone }: AdminActionProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const run = () => {
    if (confirmMessage && !window.confirm(confirmMessage)) return;
    setError(null);
    startTransition(async () => {
      try {
        await api(path, { method, body: body ? JSON.stringify(body) : undefined });
        router.refresh();
        onDone?.();
      } catch (e: unknown) {
        const err = e as { message?: string };
        setError(err.message ?? 'Action failed');
      }
    });
  };

  return (
    <span className="inline-flex items-center gap-2">
      <Button variant={variant} size={size} onClick={run} disabled={pending} aria-busy={pending}>
        {pending ? loadingLabel : label}
      </Button>
      {error && <span className="text-xs text-red-600" role="alert">{error}</span>}
    </span>
  );
}
