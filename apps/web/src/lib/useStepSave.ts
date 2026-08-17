'use client';

import { useCallback, useRef, useState } from 'react';

export type StepSaveStatus = 'idle' | 'saving' | 'error' | 'success';

interface UseStepSaveResult {
  status: StepSaveStatus;
  error: string | null;
  save: (fn: () => Promise<void>) => Promise<void>;
  retry: () => void;
  reset: () => void;
}

/**
 * Shared save-state machine for onboarding steps. Every step uses this
 * identically instead of hand-rolling its own try/catch/spinner. `save` runs
 * the async mutation; on throw it captures the message and flips to 'error'
 * (caller shows it via AuthError/StepError). `retry` re-runs the last fn.
 */
export function useStepSave(): UseStepSaveResult {
  const [status, setStatus] = useState<StepSaveStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const lastFn = useRef<(() => Promise<void>) | null>(null);

  const save = useCallback(
    async (fn: () => Promise<void>) => {
      lastFn.current = fn;
      setError(null);
      setStatus('saving');
      try {
        await fn();
        setStatus('success');
      } catch (err) {
        const e = err as { message?: string };
        setError(e?.message ?? 'Something went wrong. Please try again.');
        setStatus('error');
      }
    },
    [],
  );

  const retry = useCallback(() => {
    if (lastFn.current) void save(lastFn.current);
  }, [save]);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
  }, []);

  return { status, error, save, retry, reset };
}
