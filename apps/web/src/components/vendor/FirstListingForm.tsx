'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { createListing, getCategories } from '@/lib/vendor-client';
import { api } from '@/lib/api';
import { ImageUploader } from './ImageUploader';
import { DraftBanner } from './DraftBanner';

const schema = z.object({
  categoryId: z.string().min(1, 'Select a category'),
  title: z.string().min(3, 'At least 3 characters').max(60),
  description: z.string().min(50, 'At least 50 characters').max(500),
  priceMin: z.coerce.number().nonnegative('Must be 0 or more'),
  priceMax: z.coerce.number().nonnegative().optional(),
  section: z.string().max(50).optional(),
});

type FormData = z.infer<typeof schema>;

export function FirstListingForm() {
  const router = useRouter();
  const [categories, setCategories] = useState<Array<{ id: string; slug: string; name: string; iconName?: string | null; description?: string | null; displayOrder: number; isOfficial: boolean }>>([]);
  const [photos, setPhotos] = useState<Array<{ publicId: string; url: string; width: number; height: number; displayOrder: number }>>([]);
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [customCategoryDescription, setCustomCategoryDescription] = useState('');
  const [customCategoryIcon, setCustomCategoryIcon] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const createCustomCategory = async () => {
    if (!customCategoryName.trim() || creatingCategory) return;
    setCreatingCategory(true);
    setCategoryError(null);
    try {
      const res = await api<{ category: { id: string; name: string; slug: string; description: string | null; iconName: string | null; displayOrder: number; isOfficial: boolean } }>('/api/categories', {
        method: 'POST',
        body: JSON.stringify({
          name: customCategoryName.trim(),
          description: customCategoryDescription.trim() || undefined,
          iconName: customCategoryIcon.trim() || undefined,
        }),
      });
      setCategories((prev) => [...prev, res.category]);
      setValue('categoryId', res.category.id, { shouldValidate: true });
      setCustomCategoryName('');
      setCustomCategoryDescription('');
      setCustomCategoryIcon('');
    } catch (error) {
      setCategoryError((error as any)?.message ?? 'Could not create category');
    } finally {
      setCreatingCategory(false);
    }
  };


  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { priceMin: 0 },
  });

  useEffect(() => {
    getCategories().then((res) => setCategories(res.categories));
  }, []);

  const onSubmit = async (data: FormData) => {
    if (photos.length === 0) return;
    await createListing({
      categoryId: data.categoryId,
      title: data.title,
      description: data.description,
      priceMin: data.priceMin,
      priceMax: data.priceMax,
      section: data.section,
      photos: photos.map((p, i) => ({ ...p, altText: data.title, displayOrder: i })),
    });
    router.push('/vendor/onboarding/step-5');
  };

  const handlePhotoAdd = (result: { publicId: string; url: string; width: number; height: number } | null) => {
    if (result) {
      setPhotos((prev) => [...prev, { ...result, displayOrder: prev.length }]);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-forest-700 dark:text-cream-100 mb-2">Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setValue('categoryId', cat.id, { shouldValidate: true })}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  watch('categoryId') === cat.id
                    ? 'border-forest-700 bg-forest-700 text-cream-100'
                    : 'border-cream-300 text-forest-700 hover:border-forest-700/30 dark:border-forest-700 dark:text-cream-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>}
        </div>

        <div className="rounded-2xl border border-dashed border-cream-300 p-4 dark:border-forest-700">
          <p className="text-xs font-medium uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">Custom category</p>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Input label="Name" value={customCategoryName} onChange={(e) => setCustomCategoryName(e.target.value)} placeholder="e.g. Graphics design" />
            <Input label="Description" value={customCategoryDescription} onChange={(e) => setCustomCategoryDescription(e.target.value)} placeholder="Optional" />
            <Input label="Icon name" value={customCategoryIcon} onChange={(e) => setCustomCategoryIcon(e.target.value)} placeholder="Optional" />
          </div>
          {categoryError && <p className="mt-2 text-sm text-red-600">{categoryError}</p>}
          <div className="mt-3">
            <Button type="button" variant="outline" onClick={createCustomCategory} isLoading={creatingCategory}>
              Create & select category
            </Button>
          </div>
        </div>

        <Input label="Title" placeholder="e.g. Jollof rice + chicken" maxLength={60} error={errors.title?.message} {...register('title')} />
        <Textarea label="Description" rows={3} maxLength={500} placeholder="What's included? Any special options?" error={errors.description?.message} {...register('description')} />

        <div className="grid grid-cols-2 gap-3">
          <Input label="Price (₦)" type="number" inputMode="numeric" placeholder="1500" error={errors.priceMin?.message} {...register('priceMin')} />
          <Input label="Max price (optional)" type="number" inputMode="numeric" placeholder="2500" error={errors.priceMax?.message} {...register('priceMax')} />
        </div>

        <Input label="Section (optional)" placeholder="e.g. Breakfast, Lunch" maxLength={50} helperText="Group similar listings on your storefront" {...register('section')} />

        <div>
          <label className="block text-sm font-medium text-forest-700 dark:text-cream-100 mb-2">Photos</label>
          <p className="text-xs text-forest-700/60 dark:text-cream-100/60 mb-3">Add at least 1 photo (max 8). Use real photos of your work.</p>
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
            {photos.length < 8 && (
              <ImageUploader onChange={handlePhotoAdd} aspectRatio="square" />
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="ghost" onClick={() => router.push('/vendor/onboarding/step-3')}>
            Back
          </Button>
          <Button type="submit" isLoading={isSubmitting} disabled={photos.length === 0}>
            Continue
          </Button>
        </div>
      </form>
      <DraftBanner<FormData> step="step-4" watch={watch} enabled={!isSubmitting} />
    </>
  );
}
