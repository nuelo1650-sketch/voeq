'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { signUpWithPassword } from '@/lib/auth-client';

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Za-z]/, 'Password must contain a letter')
    .regex(/[0-9]/, 'Password must contain a number'),
});

type SignupInput = z.infer<typeof signupSchema>;

export function SignUpForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupInput) => {
    setSubmitError(null);
    try {
      await signUpWithPassword(data);
      const params = new URLSearchParams({ email: data.email });
      router.push(`/verify-otp?${params.toString()}`);
    } catch (err) {
      const error = err as { error?: string; message?: string };
      setSubmitError(error.message ?? 'Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Name"
        type="text"
        autoComplete="name"
        placeholder="Your full name"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label="Email"
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
      {submitError && (
        <p className="text-sm text-red-600">{submitError}</p>
      )}
      <Button type="submit" isLoading={isSubmitting} className="w-full">
        Create account
      </Button>
    </form>
  );
}
