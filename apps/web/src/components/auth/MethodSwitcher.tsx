'use client';

import Link from 'next/link';

interface MethodSwitcherProps {
  type: 'signin' | 'signup';
  currentMethod: 'password' | 'otp' | 'magic';
}

export function MethodSwitcher({ type }: MethodSwitcherProps) {
  const isSignin = type === 'signin';
  const otherPage = isSignin ? '/signup' : '/signin';
  const otherPageText = isSignin ? 'Create one' : 'Sign in';

  return (
    <p className="text-center text-sm text-forest-700/70 dark:text-cream-100/70">
      {isSignin ? "Don't have an account?" : 'Already have an account?'}{' '}
      <Link
        href={otherPage}
        className="font-medium text-forest-700 underline-offset-2 hover:underline dark:text-gold-500 dark:text-cream-100"
      >
        {otherPageText}
      </Link>
    </p>
  );
}
