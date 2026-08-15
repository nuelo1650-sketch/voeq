'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { ImageUploader } from '@/components/vendor/ImageUploader';
import { upsertVendor, createListing, getCategories, type CategoryNode } from '@/lib/vendor-client';
import type { UploadResult } from '@/lib/upload-client';

const MAX_CATEGORIES = 5;

export default function Step3Page() {
  const router = useRouter();

  // Profile photo
  const [photo, setPhoto] = useState<UploadResult | null>(null);

  // Listing
  const [tree, setTree] = useState<CategoryNode[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priceMin, setPriceMin] = useState('0');
  const [photos, setPhotos] = useState<Array<{ publicId: string; url: string; width: number; height: number; displayOrder: number }>>([]);
  const [categoriesError, setCategoriesError] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCategories()
      .then((res) => setTree(res.categories))
      .catch(() => setCategoriesError(true));
  }, []);

  const toggleCategory = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_CATEGORIES) return prev;
      return [...prev, id];
    });
  };

  const onContinue = async () => {
    if (!photo) { setError('Add a profile photo to continue.'); return; }
    if (photos.length === 0) { setError('Add at least one listing photo.'); return; }
    if (selectedIds.length === 0) { setError('Pick at least one category.'); return; }
    if (!title.trim()) { setError('Add a title for your listing.'); return; }
    setSaving(true);
    setError(null);
    try {
      await upsertVendor({ profilePhotoPublicId: photo.publicId });
      await createListing({
        categoryIds: selectedIds,
        title: title.trim(),
        description: description.trim(),
        priceMin: Number(priceMin) || 0,
        photos: photos.map((p, i) => ({ ...p, altText: title.trim(), displayOrder: i })),
      });
      router.push('/vendor/onboarding/step-4');
    } catch {
      setError('Could not save. Check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100 sm:text-3xl">
          Add your photo &amp; first listing
        </h1>
        <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">
          A clear profile photo and one listing get you discovered faster.
        </p>
      </div>

      {/* Two-panel layout: photo left, listing right (stacks on mobile) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        {/* Profile photo */}
        <section className="lg:sticky lg:top-6 lg:self-start">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-forest-700/70 dark:text-cream-100/70">
            Profile photo
          </h2>
          <p className="mb-3 text-xs text-forest-700/60 dark:text-cream-100/60">
            Shows on your storefront and listing cards.
          </p>
          <div className="mx-auto w-full max-w-[240px]">
            <ImageUploader value={photo} onChange={setPhoto} aspectRatio="square" folder="profile" />
          </div>
        </section>

        {/* First listing */}
        <section className="space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-forest-700/70 dark:text-cream-100/70">
            Your first listing
          </h2>

          {categoriesError ? (
            <div className="rounded-2xl border border-cream-300 bg-cream-50 p-4 text-center dark:border-forest-700 dark:bg-forest-800 dark:border-cream-100">
              <p className="text-sm text-forest-700/80 dark:text-cream-100/80">Couldn&apos;t load categories.</p>
              <Button type="button" variant="outline" className="mt-3" onClick={() => { setCategoriesError(false); getCategories().then((r) => setTree(r.categories)).catch(() => setCategoriesError(true)); }}>Retry</Button>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <p className="mb-2 text-sm font-medium text-forest-700 dark:text-cream-100">Categories</p>
                <p className="mb-3 text-xs text-forest-700/60 dark:text-cream-100/60">Pick up to {MAX_CATEGORIES}. The first is your primary.</p>
                <div className="space-y-3">
                  {tree.map((parent) => (
                    <div key={parent.id} className="rounded-2xl border border-cream-300 bg-cream-50/60 p-4 dark:border-forest-700 dark:bg-forest-800/40 dark:border-cream-100">
                      <p className="mb-2 text-sm font-semibold text-forest-900 dark:text-cream-100">{parent.name}</p>
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => toggleCategory(parent.id)} className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${selectedIds.includes(parent.id) ? 'border-forest-700 bg-forest-700 text-cream-100' : 'border-cream-300 text-forest-700 hover:border-forest-700/30 dark:border-forest-700 dark:text-cream-100'}`}>{parent.name}</button>
                        {parent.children.map((child) => (
                          <button key={child.id} type="button" onClick={() => toggleCategory(child.id)} className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${selectedIds.includes(child.id) ? 'border-forest-700 bg-forest-700 text-cream-100' : 'border-cream-300 text-forest-700 hover:border-forest-700/30 dark:border-forest-700 dark:text-cream-100'}`}>{child.name}</button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {selectedIds.length === 0 && <p className="mt-2 text-sm text-red-600">Select at least one category.</p>}
              </div>

              <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Jollof rice + chicken" maxLength={60} />
              <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} maxLength={500} placeholder="What's included? Any special options?" />
              <Input label="Price (₦)" type="number" inputMode="numeric" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} placeholder="1500" />

              <div>
                <p className="mb-1 text-sm font-medium text-forest-700 dark:text-cream-100">Photos</p>
                <p className="mb-3 text-xs text-forest-700/60 dark:text-cream-100/60">Add at least 1 photo (max 8). Use real photos of your work.</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {photos.map((p, i) => (
                    <div key={p.publicId + i} className="relative aspect-square">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.url} alt={`Photo ${i + 1}`} className="h-full w-full rounded-lg object-cover" />
                      <button type="button" onClick={() => setPhotos((prev) => prev.filter((_, idx) => idx !== i))} className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-forest-900/80 text-cream-100 text-xs">×</button>
                    </div>
                  ))}
                  {photos.length < 8 && <ImageUploader onChange={(r) => r && setPhotos((prev) => [...prev, { ...r, displayOrder: prev.length }])} aspectRatio="square" folder="listing" />}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex items-center justify-between border-t border-cream-200 pt-6 dark:border-forest-700">
        <Button variant="ghost" onClick={() => router.push('/vendor/onboarding/step-2')}>Back</Button>
        <Button onClick={onContinue} isLoading={saving}>Continue</Button>
      </div>
    </div>
  );
}
