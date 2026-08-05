'use client';

import { forwardRef, type InputHTMLAttributes, useId } from 'react';
import { cn } from '@/lib/utils';

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { className, label, error, id, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="w-full space-y-1.5">
      <label htmlFor={inputId} className="flex items-start gap-3 cursor-pointer">
        <input
          ref={ref}
          id={inputId}
          type="radio"
          className={cn(
            'mt-0.5 h-5 w-5 border-2 border-cream-300 text-forest-700',
            'focus:ring-2 focus:ring-gold-500 focus:ring-offset-2',
            'dark:border-forest-600 dark:bg-forest-800',
            className,
          )}
          {...props}
        />
        <span className="text-sm text-forest-700 dark:text-cream-100">{label}</span>
      </label>
      {error && <p className="text-sm text-red-600 ml-8">{error}</p>}
    </div>
  );
});
