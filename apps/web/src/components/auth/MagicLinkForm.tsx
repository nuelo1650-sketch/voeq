'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { requestMagicLink } from '@/lib/auth-client';

const schema = z.object({
  email: z.string().email('Invalid email address'),
});

type Input = z.infer<typeof schema>;

export function MagicLinkForm() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Input>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Input) => {
    setError(null);
    try {
      await requestMagicLink(data);
      setSubmitted(true);
      const params = new URLSearchParams({ email: data.email });
      router.push(`/magic-link-sent?${params.toString()}`);
    } catch {
      setError('Something went wrong. Please try again.');
    }
  };

  if (submitted) return null;

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
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" isLoading={isSubmitting} className="w-full">
        Send sign-in link
      </Button>
    </form>
  );
}
