'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { signInWithPassword } from '@/lib/auth-client';

const signinSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type SigninInput = z.infer<typeof signinSchema>;

export function SignInForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninInput>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = async (data: SigninInput) => {
    setSubmitError(null);
    try {
      await signInWithPassword(data);
      router.push('/home');
    } catch (err) {
      const error = err as { error?: string };
      if (error.error === 'InvalidCredentials') {
        setSubmitError('Invalid email or password');
      } else {
        setSubmitError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        autoComplete="current-password"
        placeholder="Your password"
        error={errors.password?.message}
        {...register('password')}
      />
      {submitError && <p className="text-sm text-red-600">{submitError}</p>}
      <Button type="submit" isLoading={isSubmitting} className="w-full">
        Sign in
      </Button>
    </form>
  );
}
