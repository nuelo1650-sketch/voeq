'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUploader } from './ImageUploader';
import { Button } from '@/components/ui/Button';
import { upsertVendor, getMyVendor } from '@/lib/vendor-client';
import type { UploadResult } from '@/lib/upload-client';

export function ProfilePhotoUpload() {
  const router = useRouter();
  const [photo, setPhoto] = useState<UploadResult | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMyVendor().then((res) => {
      if ('vendor' in res && res.vendor.profilePhotoPublicId) {
        setPhoto({
          publicId: res.vendor.profilePhotoPublicId,
          url: '',
          width: 0,
          height: 0,
          size: 0,
          variants: {
            thumbnail: '',
            small: '',
            medium: '',
            large: '',
            placeholder: '',
          },
        });
      }
    });
  }, []);

  const handleContinue = async () => {
    if (!photo) return;
    setSaving(true);
    try {
      await upsertVendor({ profilePhotoPublicId: photo.publicId });
      router.push('/vendor/onboarding/step-4');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-forest-700/80 dark:text-cream-100/80">
          Upload a profile photo. This will be shown on your storefront and listing cards.
        </p>
        <p className="mt-2 text-xs text-forest-700/60 dark:text-cream-100/60">
          Tip: Use a clear, well-lit photo. No logos, no stock images.
        </p>
      </div>

      <div className="mx-auto max-w-sm">
        <ImageUploader
          value={photo}
          onChange={setPhoto}
          aspectRatio="square"
          folder="profile"
        />
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="ghost" onClick={() => router.push('/vendor/onboarding/step-2')}>
          Back
        </Button>
        <Button onClick={handleContinue} isLoading={saving} disabled={!photo}>
          Continue
        </Button>
      </div>
    </div>
  );
}
