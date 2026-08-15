'use client';

import { useState } from 'react';

interface ConfirmDialogProps {
  title: string;
  description?: string;
  confirmLabel?: string;
  confirmType?: 'default' | 'destructive';
  requireTypedValue?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export function ConfirmDialog({ title, description, confirmLabel = 'Confirm', confirmType = 'default', requireTypedValue, onConfirm, onCancel }: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState('');
  const [loading, setLoading] = useState(false);

  const canConfirm = requireTypedValue ? typed === requireTypedValue : true;

  const handleConfirm = async () => {
    if (!canConfirm) return;
    setLoading(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-cream-300 px-3 py-1.5 text-sm font-medium text-forest-900 hover:border-forest-700/40 dark:text-cream-100 dark:border-forest-700 dark:border-cream-100/40"
      >
        {confirmLabel}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl border border-cream-300 bg-cream-50 p-6 shadow-xl dark:border-forest-700 dark:bg-forest-800 dark:border-cream-100">
            <h3 className="font-serif text-lg font-semibold text-forest-900 dark:text-cream-100">{title}</h3>
            {description ? <p className="mt-2 text-sm text-forest-700/80 dark:text-cream-100/80">{description}</p> : null}
            {requireTypedValue ? (
              <label className="mt-4 block text-xs font-medium text-forest-700/70 dark:text-cream-100/70">
                Type <span className="font-semibold">{requireTypedValue}</span> to confirm
                <input
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-cream-300 bg-white px-3 py-2 text-sm dark:bg-forest-900 dark:border-forest-700"
                />
              </label>
            ) : null}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setOpen(false); onCancel?.(); }}
                className="rounded-full border border-cream-300 px-4 py-2 text-sm font-medium text-forest-900 hover:border-forest-700/40 dark:text-cream-100 dark:border-forest-700 dark:border-cream-100/40"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!canConfirm || loading}
                onClick={handleConfirm}
                className={`rounded-full px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${confirmType === 'destructive' ? 'bg-red-600 hover:bg-red-500' : 'bg-forest-700 hover:bg-forest-600'}`}
              >
                {loading ? 'Working…' : confirmLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
