'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { upsertVendor, getDrafts } from '@/lib/vendor-client';
import { DraftBanner } from './DraftBanner';
import { useStepSave } from '@/lib/useStepSave';
import { AuthError } from '@/components/auth/AuthError';

const DESCRIPTION_MIN = 50;

const schema = z.object({
  businessName: z.string().min(3, 'At least 3 characters').max(100),
  ownerName: z.string().min(1, 'Required').max(100),
  description: z.string().min(DESCRIPTION_MIN, `At least ${DESCRIPTION_MIN} characters`).max(500),
});

type FormData = z.infer<typeof schema>;

interface BusinessBasicsFormProps {
  initialData?: Partial<FormData>;
}

export function BusinessBasicsForm({ initialData }: BusinessBasicsFormProps) {
  const router = useRouter();
  const [defaultValues, setDefaultValues] = useState<Partial<FormData>>(initialData ?? {});
  const { status, error, save } = useStepSave();

  useEffect(() => {
    getDrafts()
      .then((res) => {
        const draft = res.drafts?.['step-1'] as Partial<FormData> | undefined;
        if (draft && typeof draft === 'object') {
          setDefaultValues((prev) => ({ ...prev, ...draft }));
        }
      })
      .catch(() => {});
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const description = watch('description') ?? '';
  const businessName = watch('businessName') ?? '';
  const descLen = description.length;

  const onSubmit = (data: FormData) =>
    save(async () => {
      await upsertVendor(data);
      router.push('/vendor/onboarding/step-2');
    });

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
        {/* Left: form with visual hierarchy */}
        <div className="space-y-6">
          <div>
            <Input
              label="Business name"
              placeholder="e.g. Mama's Kitchen"
              autoComplete="organization"
              className="text-lg font-semibold"
              error={errors.businessName?.message}
              {...register('businessName')}
            />
            <p className="mt-1 text-xs text-forest-700/60 dark:text-cream-100/60">
              This is the headline shoppers see on your cards, listings, and profile.
            </p>
          </div>

          <div>
            <Input
              label="Owner name"
              placeholder="Your full name"
              autoComplete="name"
              error={errors.ownerName?.message}
              {...register('ownerName')}
            />
            <p className="mt-1 text-xs text-forest-700/60 dark:text-cream-100/60">
              For our records only — not shown publicly.
            </p>
          </div>

          <div>
            <Textarea
              label="Description"
              placeholder="Tell students about your business. What do you offer? What makes you special?"
              rows={4}
              maxLength={500}
              error={errors.description?.message}
              {...register('description')}
            />
            <p
              className={`mt-1 text-xs ${descLen < DESCRIPTION_MIN ? 'text-forest-700/60 dark:text-cream-100/60' : 'text-gold-600 dark:text-gold-400'}`}
            >
              {descLen}/{DESCRIPTION_MIN} minimum
            </p>
          </div>

          <div className="flex justify-end">
            <Button type="submit" isLoading={status === 'saving'}>Continue</Button>
          </div>
          <AuthError>{error}</AuthError>
        </div>

        {/* Right: live preview of how description renders on the public profile */}
        <aside className="hidden lg:block">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">
            Live preview
          </p>
          <div className="rounded-2xl border border-cream-300 bg-cream-50 p-4 dark:border-forest-700 dark:bg-forest-800 dark:border-cream-100">
            <p className="font-serif text-lg font-semibold text-forest-900 dark:text-cream-100">
              {businessName || 'Your business name'}
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-forest-700/80 dark:text-cream-100/80">
              {description || 'Your description appears here as shoppers will see it on your profile.'}
            </p>
          </div>
        </aside>
      </form>
      <DraftBanner<FormData> step="step-1" watch={watch} enabled={status !== 'saving'} />
    </>
  );
}
