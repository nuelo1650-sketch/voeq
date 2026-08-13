'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode, useId, useState } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  inputClassName?: string;
  /** When true and type is "password", renders a show/hide toggle. */
  revealable?: boolean;
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
      <path d="m4 4 16 16" />
    </svg>
  );
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, error, helperText, leftIcon, rightIcon, inputClassName, id, revealable, type, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === 'password';
  const effectiveType = isPassword && revealed ? 'text' : type;

  const toggle = revealable && isPassword ? (
    <button
      type="button"
      onClick={() => setRevealed((v) => !v)}
      aria-label={revealed ? 'Hide password' : 'Show password'}
      className="text-forest-700/50 transition hover:text-forest-900 dark:text-cream-100/50 dark:hover:text-cream-100"
    >
      <EyeIcon open={revealed} />
    </button>
  ) : null;

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
          type={effectiveType}
          className={cn(
            'w-full rounded-lg border bg-cream-50 px-4 py-3 text-base text-forest-900',
            'placeholder:text-forest-700/40',
            'focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'dark:bg-forest-800 dark:text-cream-100 dark:placeholder:text-cream-100/40',
            leftIcon && 'pl-10',
            rightIcon || toggle ? 'pr-10' : '',
            error ? 'border-red-500' : 'border-cream-300 dark:border-forest-700',
            inputClassName,
            className,
          )}
          {...props}
        />
        {toggle || rightIcon ? (
          <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-3 text-forest-700/40 dark:text-cream-100/40">
            {rightIcon}
            {toggle}
          </div>
        ) : null}
      </div>
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      {helperText && !error && <p className="text-sm text-forest-700/60 dark:text-cream-100/60">{helperText}</p>}
    </div>
  );
});
