'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { signUpWithPassword, getCurrentAgreements } from '@/lib/auth-client';

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Za-z]/, 'Password must contain a letter')
    .regex(/[0-9]/, 'Password must contain a number'),
  agreedToTerms: z.literal(true, {
    errorMap: () => ({ message: 'Please accept the Terms & Privacy Policy' }),
  }),
});

type SignupInput = z.infer<typeof signupSchema>;

export function SignUpForm({ onSuccess }: { onSuccess?: (email: string) => void }) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [agreementVersion, setAgreementVersion] = useState<string>('1.0');

  useEffect(() => {
    getCurrentAgreements()
      .then((agreements) => {
        if (agreements?.tos?.version) setAgreementVersion(agreements.tos.version);
      })
      .catch(() => {
        /* keep default '1.0' */
      });
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { agreedToTerms: undefined as unknown as true },
  });

  const agreed = watch('agreedToTerms');

  const onSubmit = async (data: SignupInput) => {
    setSubmitError(null);
    try {
      await signUpWithPassword({
        name: data.name,
        email: data.email,
        password: data.password,
        agreedToTerms: true,
        agreementVersion,
      });
      onSuccess?.(data.email);
    } catch (err) {
      const error = err as { error?: string; message?: string };
      setSubmitError(error.message ?? 'Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Full name"
        type="text"
        autoComplete="name"
        placeholder="Your full name"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label="Campus email"
        type="email"
        autoComplete="email"
        placeholder="you@school.edu.ng"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Password"
        type="password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
        helperText="Must include a letter and a number"
        error={errors.password?.message}
        {...register('password')}
      />

      <Checkbox
        label={
          <span>
            I agree to Voeq&apos;s{' '}
            <a
              href="/terms"
              target="_blank"
              className="font-medium text-forest-900 underline underline-offset-2 dark:text-cream-100 dark:hover:text-gold-400"
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href="/privacy"
              target="_blank"
              className="font-medium text-forest-900 underline underline-offset-2 dark:text-cream-100 dark:hover:text-gold-400"
            >
              Privacy Policy
            </a>
            .
          </span>
        }
        checked={!!agreed}
        onChange={(e) => setValue('agreedToTerms', e.target.checked as true, { shouldValidate: true })}
      />
      {errors.agreedToTerms && (
        <p className="text-sm text-red-600" role="alert">
          {errors.agreedToTerms.message}
        </p>
      )}

      {submitError && <p className="text-sm text-red-600" role="alert">{submitError}</p>}
      <Button type="submit" isLoading={isSubmitting} fullWidth className="h-12">
        Create account
      </Button>
    </form>
  );
}
