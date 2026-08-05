'use client';

import { forwardRef, type TextareaHTMLAttributes, useId } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, label, error, helperText, id, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-forest-700 dark:text-cream-100">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        className={cn(
          'w-full rounded-lg border bg-cream-50 px-4 py-3 text-base text-forest-900',
          'placeholder:text-forest-700/40',
          'focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'dark:bg-forest-800 dark:text-cream-100 dark:placeholder:text-cream-100/40',
          'min-h-[100px] resize-y',
          error ? 'border-red-500' : 'border-cream-300 dark:border-forest-700',
          className,
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      {helperText && !error && <p className="text-sm text-forest-700/60 dark:text-cream-100/60">{helperText}</p>}
    </div>
  );
});
