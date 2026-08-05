'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { upsertVendor, type VendorProfile } from '@/lib/vendor-client';

const schema = z.object({
  businessName: z.string().min(3).max(100),
  ownerName: z.string().min(1).max(100),
  description: z.string().min(100).max(500),
  whatsappNumber: z.string().regex(/^\+?[1-9]\d{6,14}$/),
  publicPhone: z.string().regex(/^\+?[1-9]\d{6,14}$/).optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

export function VendorProfileForm({ vendor }: { vendor: VendorProfile }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      businessName: vendor.businessName,
      ownerName: vendor.ownerName,
      description: vendor.description,
      whatsappNumber: vendor.whatsappNumber,
      publicPhone: vendor.publicPhone ?? '',
    },
  });

  const onSubmit = async (data: FormData) => {
    await upsertVendor({
      businessName: data.businessName,
      ownerName: data.ownerName,
      description: data.description,
      whatsappNumber: data.whatsappNumber,
      publicPhone: data.publicPhone || undefined,
    });
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">Business profile</h1>
      <Input label="Business name" error={errors.businessName?.message} {...register('businessName')} />
      <Input label="Owner name" error={errors.ownerName?.message} {...register('ownerName')} />
      <Textarea label="Description" rows={4} maxLength={500} error={errors.description?.message} {...register('description')} />
      <Input label="WhatsApp number" type="tel" error={errors.whatsappNumber?.message} {...register('whatsappNumber')} />
      <Input label="Public phone (optional)" type="tel" error={errors.publicPhone?.message} {...register('publicPhone')} />
      <Button type="submit" isLoading={isSubmitting} disabled={!isDirty}>Save changes</Button>
    </form>
  );
}
