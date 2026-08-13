'use client';

import { useState } from 'react';
import Image from 'next/image';
import { uploadImage, validateImageFile, type UploadResult } from '@/lib/upload-client';
import { Spinner } from '@/components/ui/Spinner';
import { CloseIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  value?: UploadResult | null;
  onChange: (result: UploadResult | null) => void;
  aspectRatio?: 'square' | 'video' | 'auto';
  folder?: 'profile' | 'listing' | 'category';
  className?: string;
}

export function ImageUploader({ value, onChange, aspectRatio = 'square', folder = 'listing', className }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    auto: '',
  };

  const handleFile = async (file: File) => {
    setError(null);
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error ?? 'Invalid file');
      return;
    }

    setUploading(true);
    try {
      const result = await uploadImage(file, folder);
      onChange(result);
    } catch (err) {
      const e = err as { message?: string };
      setError(e.message ?? 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    onChange(null);
  };

  if (value) {
    return (
      <div className={cn('relative overflow-hidden rounded-2xl', aspectClasses[aspectRatio], className)}>
        <Image
          src={value.variants.medium}
          alt="Uploaded"
          fill
          className="object-cover"
          placeholder="blur"
          blurDataURL={value.variants.placeholder}
        />
        <button
          type="button"
          onClick={handleRemove}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-forest-900/80 text-cream-100 hover:bg-forest-900"
          aria-label="Remove image"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-cream-50 px-6 py-8 text-center transition cursor-pointer',
        dragActive ? 'border-forest-700 bg-forest-700/5' : 'border-cream-300 dark:border-forest-700 dark:bg-forest-800',
        aspectClasses[aspectRatio],
        className,
      )}
    >
      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleChange} className="sr-only" />
      {uploading ? (
        <Spinner size="lg" />
      ) : (
        <>
          <p className="text-sm font-medium text-forest-900 dark:text-cream-100">
            Tap to upload or drag and drop
          </p>
          <p className="mt-1 text-xs text-forest-700/60 dark:text-cream-100/60">
            JPEG, PNG, WebP · Max 5MB
          </p>
        </>
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </label>
  );
}
