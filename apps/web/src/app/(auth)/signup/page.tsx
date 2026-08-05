'use client';

import { GoogleButton } from '@/components/auth/GoogleButton';
import { AuthDivider } from '@/components/auth/AuthDivider';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { MethodSwitcher } from '@/components/auth/MethodSwitcher';

export default function SignUpPage() {
  const handleGoogle = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">
          Join Voeq
        </h1>
        <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">
          Find vendors, save listings, and connect with sellers on your campus
        </p>
      </div>

      <GoogleButton onClick={handleGoogle} text="Sign up with Google" />
      <AuthDivider />
      <SignUpForm />
      <MethodSwitcher type="signup" currentMethod="password" />
    </div>
  );
}
