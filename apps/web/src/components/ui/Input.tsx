'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode, useId } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  inputClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, error, helperText, leftIcon, rightIcon, inputClassName, id, ...props },
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
      <div className="relative">
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-forest-700/40 dark:text-cream-100/40">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-lg border bg-cream-50 px-4 py-3 text-base text-forest-900',
            'placeholder:text-forest-700/40',
            'focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'dark:bg-forest-800 dark:text-cream-100 dark:placeholder:text-cream-100/40',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error ? 'border-red-500' : 'border-cream-300 dark:border-forest-700',
            inputClassName,
            className,
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-forest-700/40 dark:text-cream-100/40">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      {helperText && !error && <p className="text-sm text-forest-700/60 dark:text-cream-100/60">{helperText}</p>}
    </div>
  );
});
