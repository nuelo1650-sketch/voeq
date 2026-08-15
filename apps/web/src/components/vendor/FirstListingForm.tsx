'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { createListing, getCategories, type CategoryNode } from '@/lib/vendor-client';
import { api } from '@/lib/api';
import { ImageUploader } from './ImageUploader';
import { DraftBanner } from './DraftBanner';
import { cn } from '@/lib/utils';
import type { UploadResult } from '@/lib/upload-client';

const MAX_CATEGORIES = 5;

const schema = z.object({
  title: z.string().min(3, 'At least 3 characters').max(60),
  description: z.string().min(50, 'At least 50 characters').max(500),
  priceMin: z.coerce.number().nonnegative('Must be 0 or more'),
  priceMax: z.coerce.number().nonnegative().optional(),
  section: z.string().max(50).optional(),
});

type FormData = z.infer<typeof schema>;

export function FirstListingForm() {
  const router = useRouter();
  const [tree, setTree] = useState<CategoryNode[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [photos, setPhotos] = useState<Array<{ publicId: string; url: string; width: number; height: number; displayOrder: number }>>([]);

  // Custom category state
  const [customName, setCustomName] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customImage, setCustomImage] = useState<{ publicId: string; url: string } | null>(null);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { priceMin: 0 },
  });

  useEffect(() => {
    getCategories().then((res) => setTree(res.categories));
  }, []);

  const toggleCategory = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_CATEGORIES) return prev;
      return [...prev, id];
    });
  };

  const createCustomCategory = async () => {
    if (!customName.trim() || creatingCategory) return;
    if (!customImage) {
      setCategoryError('Upload a photo for this category before creating it.');
      return;
    }
    setCreatingCategory(true);
    setCategoryError(null);
    try {
      const res = await api<{ category: CategoryNode }>('/api/categories', {
        method: 'POST',
        body: JSON.stringify({
          name: customName.trim(),
          description: customDesc.trim() || undefined,
          imagePublicId: customImage.publicId,
          imageUrl: customImage.url,
        }),
      });
      setTree((prev) => [
        ...prev,
        { ...res.category, parentId: null, listingCount: 0, children: [] },
      ]);
      setSelectedIds((prev) => (prev.length < MAX_CATEGORIES ? [...prev, res.category.id] : prev));
      setCustomName('');
      setCustomDesc('');
      setCustomImage(null);
    } catch (error) {
      setCategoryError((error as { message?: string })?.message ?? 'Could not create category');
    } finally {
      setCreatingCategory(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (photos.length === 0) return;
    if (selectedIds.length === 0) return;
    await createListing({
      categoryIds: selectedIds,
      title: data.title,
      description: data.description,
      priceMin: data.priceMin,
      priceMax: data.priceMax,
      section: data.section,
      photos: photos.map((p, i) => ({ ...p, altText: data.title, displayOrder: i })),
    });
    router.push('/vendor/onboarding/step-5');
  };

  const handlePhotoAdd = (result: UploadResult | null) => {
    if (result) {
      setPhotos((prev) => [...prev, { ...result, displayOrder: prev.length }]);
    }
  };

  const movePhoto = (index: number, dir: -1 | 1) => {
    setPhotos((prev) => {
      const target = index + dir;
      if (target < 0 || target >= prev.length) return prev;
      const a = prev[index];
      const b = prev[target];
      if (!a || !b) return prev;
      const next = [...prev];
      next[index] = b;
      next[target] = a;
      return next.map((p, i) => ({ ...p, displayOrder: i }));
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Category picker */}
        <div>
          <label className="block text-sm font-medium text-forest-700 dark:text-cream-100 mb-1">
            Categories
          </label>
          <p className="text-xs text-forest-700/60 dark:text-cream-100/60 mb-3">
            Pick up to {MAX_CATEGORIES}. The first one is your primary category.
          </p>

          <div className="space-y-4">
            {tree.map((parent) => (
              <div key={parent.id} className="rounded-2xl border border-cream-300 bg-cream-50/60 p-4 dark:border-forest-700 dark:bg-forest-800/40 dark:bg-forest-800/60 dark:border-cream-100">
                <p className="mb-2 text-sm font-semibold text-forest-900 dark:text-cream-100">
                  {parent.name}
                </p>
                <div className="flex flex-wrap gap-2">
                  {/* parent itself is selectable */}
                  <CategoryChip
                    label={parent.name}
                    selected={selectedIds.includes(parent.id)}
                    disabled={!selectedIds.includes(parent.id) && selectedIds.length >= MAX_CATEGORIES}
                    onClick={() => toggleCategory(parent.id)}
                  />
                  {parent.children.map((child) => (
                    <CategoryChip
                      key={child.id}
                      label={child.name}
                      selected={selectedIds.includes(child.id)}
                      disabled={!selectedIds.includes(child.id) && selectedIds.length >= MAX_CATEGORIES}
                      onClick={() => toggleCategory(child.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {selectedIds.length === 0 && (
            <p className="mt-2 text-sm text-red-600">Select at least one category.</p>
          )}
        </div>

        {/* Custom category */}
        <div className="rounded-2xl border border-dashed border-cream-300 p-4 dark:border-forest-700 dark:border-cream-100">
          <p className="text-xs font-medium uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">
            Can&apos;t find yours? Add a category
          </p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input label="Name" value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="e.g. Graphics design" />
            <Input label="Description" value={customDesc} onChange={(e) => setCustomDesc(e.target.value)} placeholder="Optional" />
          </div>
          <div className="mt-3">
            <p className="mb-1 text-sm font-medium text-forest-700 dark:text-cream-100">
              Category photo <span className="text-red-600">*</span>
            </p>
            <div className="max-w-[200px]">
              <ImageUploader
                value={customImage ? { publicId: customImage.publicId, url: customImage.url, width: 0, height: 0, size: 0, variants: { thumbnail: customImage.url, small: customImage.url, medium: customImage.url, large: customImage.url, placeholder: customImage.url } } : null}
                onChange={(r) => setCustomImage(r ? { publicId: r.publicId, url: r.url } : null)}
                folder="category"
                aspectRatio="square"
              />
            </div>
          </div>
          {categoryError && <p className="mt-2 text-sm text-red-600">{categoryError}</p>}
          <div className="mt-3">
            <Button type="button" variant="outline" onClick={createCustomCategory} isLoading={creatingCategory} disabled={!customName.trim() || !customImage}>
              Create &amp; select category
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
              <div key={p.publicId + i} className="relative aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={`Photo ${i + 1}`} className="h-full w-full rounded-lg object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-forest-900/80 text-cream-100 text-xs"
                  aria-label="Remove photo"
                >
                  ×
                </button>
                <div className="absolute bottom-1 left-1 flex gap-1">
                  <button
                    type="button"
                    onClick={() => movePhoto(i, -1)}
                    disabled={i === 0}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-forest-900/80 text-cream-100 text-xs disabled:opacity-30"
                    aria-label="Move left"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => movePhoto(i, 1)}
                    disabled={i === photos.length - 1}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-forest-900/80 text-cream-100 text-xs disabled:opacity-30"
                    aria-label="Move right"
                  >
                    ›
                  </button>
                </div>
                {i === 0 && (
                  <span className="absolute inset-x-0 bottom-1 mx-auto w-fit rounded-full bg-gold-500/90 px-2 py-0.5 text-[10px] font-semibold text-forest-900 dark:text-cream-100">
                    Cover
                  </span>
                )}
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
          <Button type="submit" isLoading={isSubmitting} disabled={photos.length === 0 || selectedIds.length === 0}>
            Continue
          </Button>
        </div>
      </form>
      <DraftBanner<FormData> step="step-4" watch={watch} enabled={!isSubmitting} />
    </>
  );
}

function CategoryChip({
  label,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded-full border px-3 py-1.5 text-xs font-medium transition',
        selected
          ? 'border-forest-700 bg-forest-700 text-cream-100'
          : 'border-cream-300 text-forest-700 hover:border-forest-700/30 dark:border-forest-700 dark:text-cream-100',
        disabled && 'cursor-not-allowed opacity-40',
      )}
    >
      {label}
    </button>
  );
}
