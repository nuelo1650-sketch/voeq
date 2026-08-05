'use client';

import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, label, error, helperText, options, id, ...props },
  ref,
) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-forest-700 dark:text-cream-100">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={cn(
          'w-full rounded-lg border bg-cream-50 px-4 py-3 text-base text-forest-900',
          'focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'dark:bg-forest-800 dark:text-cream-100',
          error ? 'border-red-500' : 'border-cream-300 dark:border-forest-700',
          className,
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      {helperText && !error && <p className="text-sm text-forest-700/60 dark:text-cream-100/60">{helperText}</p>}
    </div>
  );
});
