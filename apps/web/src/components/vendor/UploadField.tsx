'use client';

import { ImageUploader } from '@/components/vendor/ImageUploader';
import { AuthError } from '@/components/auth/AuthError';
import { cn } from '@/lib/utils';
import type { UploadResult } from '@/lib/upload-client';

interface UploadFieldProps {
  label?: string;
  hint?: string;
  value: UploadResult | null;
  onChange: (result: UploadResult | null) => void;
  /** 'circle' for profile photo, 'square' for listing/category photos */
  shape?: 'circle' | 'square' | 'video';
  folder?: 'profile' | 'listing' | 'category';
  className?: string;
}

/**
 * Branded wrapper around ImageUploader used by vendor onboarding step 3
 * (profile photo + listing photos) and later ProfileForm/PreferencesForm.
 * Keeps the same upload logic (same-origin /api-internal fix lives in
 * upload-client); adds consistent label, hint, and error treatment.
 */
export function UploadField({
  label,
  hint,
  value,
  onChange,
  shape = 'square',
  folder = 'listing',
  className,
}: UploadFieldProps) {
  const aspect = shape === 'circle' ? 'square' : shape === 'video' ? 'video' : 'square';

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-sm font-medium text-forest-900 dark:text-cream-100">{label}</span>
        </div>
      )}
      <div className={cn(shape === 'circle' && 'mx-auto w-32')}>
        <ImageUploader
          value={value}
          onChange={onChange}
          aspectRatio={aspect}
          folder={folder}
          className={cn(
            shape === 'circle' && 'rounded-full overflow-hidden',
            'border-forest-200 dark:border-cream-100/30',
          )}
        />
      </div>
      {hint && (
        <p className="text-xs text-forest-700/60 dark:text-cream-100/60">{hint}</p>
      )}
    </div>
  );
}
