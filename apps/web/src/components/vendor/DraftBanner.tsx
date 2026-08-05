'use client';

import { useEffect, useState } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { saveDraft } from '@/lib/vendor-client';
import { Spinner } from '@/components/ui/Spinner';

interface DraftBannerProps<T extends FieldValues> {
  step: string;
  watch: ReturnType<typeof useForm<T>>['watch'];
  enabled: boolean;
}

export function DraftBanner<T extends FieldValues>({ step, watch, enabled }: DraftBannerProps<T>) {
  const data = watch();
  const debouncedData = useDebounce(data, 1000);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    if (!enabled) return;
    if (Object.keys(debouncedData).length === 0) return;

    setStatus('saving');
    saveDraft(step, debouncedData as Record<string, unknown>)
      .then(() => setStatus('saved'))
      .catch(() => setStatus('idle'));
  }, [debouncedData, step, enabled]);

  if (status === 'idle') return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 rounded-full border border-cream-300 bg-cream-50 px-4 py-2 text-sm shadow-lg dark:border-forest-700 dark:bg-forest-800">
      {status === 'saving' ? (
        <>
          <Spinner size="sm" />
          <span className="text-forest-700 dark:text-cream-100">Saving draft…</span>
        </>
      ) : (
        <span className="text-forest-700 dark:text-cream-100">✓ Draft saved</span>
      )}
    </div>
  );
}
