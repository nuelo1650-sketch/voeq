'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthShell } from '@/components/auth/AuthShell';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { consumePasswordReset } from '@/lib/auth-client';
import { resolvePostAuthDestination } from '@/lib/auth-redirect';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const resetSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128)
      .regex(/[A-Za-z]/, 'Password must contain a letter')
      .regex(/[0-9]/, 'Password must contain a number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetInput = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [tokenError, setTokenError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetInput>({
    resolver: zodResolver(resetSchema),
  });

  useEffect(() => {
    if (!token) {
      setTokenError('Missing or invalid reset link.');
    }
  }, [token]);

  const onSubmit = async (data: ResetInput) => {
    if (!token) return;
    setSubmitError(null);
    try {
      const result = await consumePasswordReset({
        token,
        newPassword: data.newPassword,
      });
      if (result.user) {
        window.location.replace(resolvePostAuthDestination(result.user, new URLSearchParams(window.location.search).get('next')));
      }
    } catch (err: unknown) {
      const apiError = err as { error?: string; message?: string };
      if (apiError.error === 'InvalidOrExpiredToken') {
        setSubmitError('This reset link is invalid or has expired.');
      } else {
        setSubmitError(apiError.message || 'Failed to reset password. Please try again.');
      }
    }
  };

  return (
    <AuthShell
      title="Set a new password"
      subtitle="Choose a strong password you haven't used elsewhere."
    >
      <div className="px-6 pb-6 pt-8 md:px-8 md:pb-8 md:pt-10">
        <AnimatePresence mode="wait">
          {tokenError ? (
            <motion.div
              key="token-error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <div
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200"
                role="alert"
              >
                {tokenError}
              </div>
              <div className="space-y-3">
                <Link href="/forgot-password" className="block">
                  <Button variant="primary" fullWidth className="h-12">
                    Request a new reset link
                  </Button>
                </Link>
                <Link href="/signin" className="block">
                  <Button variant="outline" fullWidth className="h-12">
                    Back to sign in
                  </Button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <Input
                label="New password"
                type="password"
                revealable
                autoComplete="new-password"
                placeholder="At least 8 characters"
                helperText="Must include a letter and a number"
                error={errors.newPassword?.message}
                {...register('newPassword')}
              />
              <Input
                label="Confirm new password"
                type="password"
                revealable
                autoComplete="new-password"
                placeholder="Re-enter password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
              {submitError && (
                <div
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200"
                  role="alert"
                >
                  {submitError}
                </div>
              )}
              <Button type="submit" isLoading={isSubmitting} fullWidth className="h-12">
                Reset password
              </Button>
              <p className="text-center text-sm text-forest-700/70 dark:text-cream-100/70">
                Remember your password?{' '}
                <Link
                  href="/signin"
                  className="font-medium text-forest-900 underline underline-offset-2 transition hover:text-gold-600 dark:text-cream-100 dark:hover:text-gold-400"
                >
                  Sign in
                </Link>
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </AuthShell>
  );
}
