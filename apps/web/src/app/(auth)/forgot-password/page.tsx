'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthShell } from '@/components/auth/AuthShell';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { requestPasswordReset } from '@/lib/auth-client';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const schema = z.object({
  email: z.string().email('Invalid email address'),
});

type FormInput = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormInput) => {
    setSubmitError(null);
    try {
      await requestPasswordReset(data);
      setSubmittedEmail(data.email);
      setSubmitted(true);
    } catch {
      setSubmitError('Something went wrong. Please try again.');
    }
  };

  return (
    <AuthShell
      title={submitted ? 'Check your email' : 'Forgot password'}
      subtitle={
        submitted
          ? 'We sent a password reset link to your inbox.'
          : "Enter your email and we'll send you a link to reset your password."
      }
    >
      <div className="px-6 pb-6 pt-8 md:px-8 md:pb-8 md:pt-10">
        <AnimatePresence mode="wait">
          {!submitted ? (
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
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@school.edu.ng"
                error={errors.email?.message}
                {...register('email')}
              />
              {submitError && (
                <p className="text-sm text-red-600" role="alert">
                  {submitError}
                </p>
              )}
              <Button type="submit" isLoading={isSubmitting} fullWidth className="h-12">
                Send reset link
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
          ) : (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="rounded-xl border border-forest-900/10 bg-cream-100 p-5 dark:border-cream-100/10 dark:bg-forest-800/50">
                <div className="space-y-2">
                  <p className="text-sm text-forest-700/80 dark:text-cream-100/80">
                    We sent a password reset link to:
                  </p>
                  <p className="font-medium text-forest-900 dark:text-cream-100 break-all">
                    {submittedEmail}
                  </p>
                </div>
              </div>
              <div className="space-y-3 text-sm text-forest-700/70 dark:text-cream-100/70">
                <p>
                  <strong className="font-medium text-forest-900 dark:text-cream-100">
                    Didn\u0027t get the email?
                  </strong>{' '}
                  Check your spam folder, or{' '}
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="font-medium text-forest-900 underline underline-offset-2 hover:text-gold-600 dark:text-cream-100 dark:hover:text-gold-400"
                  >
                    try a different email
                  </button>
                  .
                </p>
                <p>
                  The link expires in 15 minutes and can only be used once.
                </p>
              </div>
              <Link href="/signin" className="block">
                <Button variant="outline" fullWidth className="h-12">
                  Back to sign in
                </Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthShell>
  );
}
