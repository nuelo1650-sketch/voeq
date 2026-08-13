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

const schema = z.object({
  businessName: z.string().min(3, 'At least 3 characters').max(100),
  ownerName: z.string().min(1, 'Required').max(100),
  description: z.string().min(100, 'At least 100 characters (helps Shoppers understand your business)').max(500),
});

type FormData = z.infer<typeof schema>;

interface BusinessBasicsFormProps {
  initialData?: Partial<FormData>;
}

export function BusinessBasicsForm({ initialData }: BusinessBasicsFormProps) {
  const router = useRouter();
  const [defaultValues, setDefaultValues] = useState<Partial<FormData>>(initialData ?? {});

  // Restore any autosaved draft over the persisted vendor data so work in
  // progress isn't lost when the user returns to this step.
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
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = async (data: FormData) => {
    await upsertVendor(data);
    router.push('/vendor/onboarding/step-2');
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input label="Business name" placeholder="e.g. Mama's Kitchen" autoComplete="organization" error={errors.businessName?.message} {...register('businessName')} />
        <Input label="Owner name" placeholder="Your full name" autoComplete="name" error={errors.ownerName?.message} {...register('ownerName')} />
        <Textarea
          label="Description"
          placeholder="Tell students about your business. What do you offer? What makes you special?"
          rows={4}
          maxLength={500}
          helperText={`${watch('description')?.length ?? 0}/500 characters (min 100)`}
          error={errors.description?.message}
          {...register('description')}
        />
        <div className="flex justify-end">
          <Button type="submit" isLoading={isSubmitting}>Continue</Button>
        </div>
      </form>
      <DraftBanner<FormData> step="step-1" watch={watch} enabled={!isSubmitting} />
    </>
  );
}
