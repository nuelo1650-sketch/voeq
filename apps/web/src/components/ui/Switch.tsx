'use client';

import { cn } from '@/lib/utils';

interface SwitchProps {
  checked?: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
}

export function Switch({ checked = false, onChange, label, error, disabled }: SwitchProps) {
  return (
    <div className="w-full space-y-1.5">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition',
          checked ? 'bg-forest-700' : 'bg-cream-300 dark:bg-forest-700',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 rounded-full bg-cream-50 shadow transition',
            checked ? 'translate-x-6' : 'translate-x-1',
          )}
        />
      </button>
      {label && <span className="text-sm text-forest-700 dark:text-cream-100">{label}</span>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
