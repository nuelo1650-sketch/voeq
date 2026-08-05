'use client';

import React, { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'gold' | 'outline' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  asChild?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-forest-700 text-cream-100 hover:bg-forest-600 active:bg-forest-800 disabled:bg-forest-700/50',
  secondary: 'bg-cream-100 text-forest-700 border border-forest-200 hover:bg-cream-200 dark:bg-forest-800 dark:text-cream-100 dark:border-forest-700 dark:hover:bg-forest-700',
  ghost: 'bg-transparent text-forest-700 hover:bg-cream-200 dark:text-cream-100 dark:hover:bg-forest-800',
  gold: 'bg-gold-500 text-forest-900 hover:bg-gold-400 active:bg-gold-600',
  outline: 'bg-transparent text-forest-700 border-2 border-forest-700 hover:bg-forest-700 hover:text-cream-100 dark:text-cream-100 dark:border-cream-100 dark:hover:bg-cream-100 dark:hover:text-forest-900',
  destructive: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-6 py-3 text-base gap-2',
  lg: 'px-8 py-4 text-lg gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled,
    leftIcon,
    rightIcon,
    fullWidth,
    asChild = false,
    children,
    type = 'button',
    ...props
  },
  ref,
) {
  const classes = cn(
    'inline-flex items-center justify-center rounded-full font-medium transition',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50 dark:focus-visible:ring-offset-forest-900',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    className,
  );

  const content = (
    <>
      {isLoading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-label="Loading" />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </>
  );

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
      className: cn(classes, (children as React.ReactElement<Record<string, unknown>>).props.className as string),
      ref,
      ...props,
    });
  }

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={classes}
      {...props}
    >
      {content}
    </button>
  );
});

Button.displayName = 'Button';
