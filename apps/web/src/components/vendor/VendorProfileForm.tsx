'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { upsertVendor, type VendorProfile } from '@/lib/vendor-client';
import { VendorHoursEditor } from '@/components/vendor/VendorHoursEditor';

const schema = z.object({
  businessName: z.string().min(3).max(100),
  ownerName: z.string().min(1).max(100),
  description: z.string().min(100).max(500),
  whatsappNumber: z.string().regex(/^\+?[1-9]\d{6,14}$/),
  publicPhone: z.string().regex(/^\+?[1-9]\d{6,14}$/).optional().or(z.literal('')),
  operatingHours: z.any().optional().nullable(),
  isAlwaysOpen: z.boolean().optional().nullable(),
  timezone: z.string().optional().nullable(),
  instagramHandle: z.string().max(50).optional().nullable(),
  tiktokHandle: z.string().max(50).optional().nullable(),
  twitterHandle: z.string().max(50).optional().nullable(),
  facebookPage: z.string().url().max(200).optional().nullable(),
  linkedinProfile: z.string().url().max(200).optional().nullable(),
  websiteUrl: z.string().url().max(200).optional().nullable(),
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
      <Input label="Instagram handle" placeholder="e.g. voeq" {...register('instagramHandle')} />
      <Input label="TikTok handle" placeholder="e.g. voeq" {...register('tiktokHandle')} />
      <Input label="Twitter handle" placeholder="e.g. voeq" {...register('twitterHandle')} />
      <Input label="Facebook page URL" placeholder="https://facebook.com/..." {...register('facebookPage')} />
      <Input label="LinkedIn profile URL" placeholder="https://linkedin.com/in/..." {...register('linkedinProfile')} />
      <Input label="Website URL" placeholder="https://..." {...register('websiteUrl')} />
      <Button type="submit" isLoading={isSubmitting} disabled={!isDirty}>Save changes</Button>
      <VendorHoursEditor
        initialHours={vendor.operatingHours ?? null}
        isAlwaysOpen={vendor.isAlwaysOpen ?? false}
        timezone={vendor.timezone ?? 'Africa/Lagos'}
        onSave={async (data) => {
          await upsertVendor({
            operatingHours: data.operatingHours,
            isAlwaysOpen: data.isAlwaysOpen,
            timezone: data.timezone,
          });
          router.refresh();
        }}
      />
    </form>
  );
}
