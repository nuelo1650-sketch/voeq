'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { ImageUploader } from './ImageUploader';
import { createListing, updateListing, getMyListing, getCategories, deleteListing } from '@/lib/vendor-client';

const schema = z.object({
  categoryIds: z.array(z.string().min(1)).min(1, 'Required').max(5),
  title: z.string().min(3).max(60),
  description: z.string().min(50).max(500),
  priceMin: z.coerce.number().nonnegative(),
  priceMax: z.coerce.number().nonnegative().optional(),
  section: z.string().max(50).optional(),
  status: z.enum(['active', 'paused']).default('active'),
});

type FormData = z.infer<typeof schema>;

interface ListingFormProps {
  mode: 'create' | 'edit';
  listingId?: string;
}

export function ListingForm({ mode, listingId }: ListingFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [photos, setPhotos] = useState<Array<{ publicId: string; url: string; width: number; height: number; displayOrder: number }>>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { priceMin: 0, status: 'active' },
  });

  useEffect(() => {
    getCategories().then((res) => setCategories(res.categories));
    if (mode === 'edit' && listingId) {
      getMyListing(listingId).then((res) => {
        const l = res.listing;
        setSelectedIds([l.category.id]);
        setValue('title', l.title);
        setValue('description', l.description);
        setValue('priceMin', l.priceMin);
        setValue('priceMax', l.priceMax ?? undefined);
        setValue('section', l.section ?? undefined);
        setValue('status', l.status === 'paused' ? 'paused' : 'active');
        setPhotos(l.photos.map((p, i) => ({ publicId: p.publicId, url: p.url, width: p.width, height: p.height, displayOrder: i })));
      });
    }
  }, [mode, listingId, setValue]);

  const onSubmit = async (data: FormData) => {
    if (photos.length === 0) return;
    const payload = {
      categoryIds: selectedIds,
      title: data.title,
      description: data.description,
      priceMin: data.priceMin,
      priceMax: data.priceMax,
      section: data.section,
      status: data.status,
      photos: photos.map((p, i) => ({ ...p, altText: data.title, displayOrder: i })),
    };
    if (mode === 'edit' && listingId) {
      await updateListing(listingId, payload);
    } else {
      await createListing(payload);
    }
    router.push('/vendor/listings');
  };

  const handleDelete = async () => {
    if (!listingId) return;
    if (!confirm('Delete this listing?')) return;
    await deleteListing(listingId);
    router.push('/vendor/listings');
  };

  const handlePhotoAdd = (result: { publicId: string; url: string; width: number; height: number } | null) => {
    if (result) setPhotos((prev) => [...prev, { ...result, displayOrder: prev.length }]);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-forest-700 dark:text-cream-100 mb-2">Categories</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedIds((prev) => (prev.includes(cat.id) ? prev.filter((x) => x !== cat.id) : prev.length >= 5 ? prev : [...prev, cat.id]))}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${selectedIds.includes(cat.id) ? 'border-forest-700 bg-forest-700 text-cream-100' : 'border-cream-300 text-forest-700 dark:border-forest-700 dark:text-cream-100'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        {selectedIds.length === 0 && <p className="mt-1 text-sm text-red-600">Select at least one category.</p>}
      </div>

      <Input label="Title" maxLength={60} error={errors.title?.message} {...register('title')} />
      <Textarea label="Description" rows={3} maxLength={500} error={errors.description?.message} {...register('description')} />

      <div className="grid grid-cols-2 gap-3">
        <Input label="Price (₦)" type="number" inputMode="numeric" error={errors.priceMin?.message} {...register('priceMin')} />
        <Input label="Max price (optional)" type="number" inputMode="numeric" error={errors.priceMax?.message} {...register('priceMax')} />
      </div>

      <Input label="Section (optional)" placeholder="e.g. Breakfast" maxLength={50} {...register('section')} />

      <div>
        <label className="block text-sm font-medium text-forest-700 dark:text-cream-100 mb-2">Status</label>
        <div className="flex gap-2">
          {(['active', 'paused'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setValue('status', s)}
              className={`rounded-full border px-4 py-2 text-sm ${
                watch('status') === s
                  ? 'border-forest-700 bg-forest-700 text-cream-100'
                  : 'border-cream-300 text-forest-700 dark:border-forest-700 dark:text-cream-100'
              }`}
            >
              {s === 'active' ? 'Active' : 'Paused'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-forest-700 dark:text-cream-100 mb-2">Photos</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {photos.map((p, i) => (
            <div key={i} className="relative aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt={`Photo ${i + 1}`} className="h-full w-full rounded-lg object-cover" />
              <button
                type="button"
                onClick={() => setPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-forest-900/80 text-cream-100 text-xs"
              >
                ×
              </button>
            </div>
          ))}
          {photos.length < 8 && <ImageUploader onChange={handlePhotoAdd} aspectRatio="square" />}
        </div>
      </div>

      <div className="flex justify-between">
        {mode === 'edit' ? (
          <Button type="button" variant="destructive" onClick={handleDelete}>Delete</Button>
        ) : (
          <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
        )}
        <Button type="submit" isLoading={isSubmitting} disabled={photos.length === 0}>
          {mode === 'edit' ? 'Save changes' : 'Create listing'}
        </Button>
      </div>
    </form>
  );
}
