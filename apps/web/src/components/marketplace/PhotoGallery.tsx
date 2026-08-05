'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface Photo {
  id: string;
  url: string;
  width: number;
  height: number;
  altText: string | null;
}

interface PhotoGalleryProps {
  photos: Photo[];
  alt: string;
}

export function PhotoGallery({ photos, alt }: PhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (photos.length === 0) {
    return (
      <div className="aspect-square w-full rounded-2xl bg-cream-200 dark:bg-forest-700" aria-label="No photos" />
    );
  }

  const activePhoto = photos[activeIndex] ?? photos[0]!;

  return (
    <div className="space-y-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-cream-200 dark:bg-forest-700">
        <Image
          src={activePhoto.url}
          alt={activePhoto.altText ?? alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                'relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2',
                index === activeIndex ? 'border-forest-700 dark:border-gold-500' : 'border-transparent',
              )}
              aria-label={`View photo ${index + 1}`}
            >
              <Image
                src={photo.url}
                alt={photo.altText ?? `${alt} photo ${index + 1}`}
                fill
                sizes="64px"
                className="object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
