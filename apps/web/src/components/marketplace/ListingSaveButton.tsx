'use client';

import { useEffect, useState } from 'react';
import { HeartIcon } from '@/components/icons';
import { addListingToWishlist, removeListingFromWishlist, checkWishlistSaved } from '@/lib/marketplace-client';

interface ListingSaveButtonProps {
  listingId: string;
  className?: string;
  /** When provided, skips the initial check call (e.g. on a page that already knows state). */
  initialSaved?: boolean;
  /** Compact = icon-only (for cards); default also shows the label. */
  showLabel?: boolean;
  fullWidth?: boolean;
}

export function ListingSaveButton({
  listingId,
  className,
  initialSaved,
  showLabel = true,
  fullWidth = false,
}: ListingSaveButtonProps) {
  const [saved, setSaved] = useState(initialSaved ?? false);
  const [checked, setChecked] = useState(initialSaved !== undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (checked) return;
    let active = true;
    checkWishlistSaved({ listingId })
      .then((r) => {
        if (active) {
          setSaved(r.saved);
          setChecked(true);
        }
      })
      .catch(() => {
        if (active) setChecked(true);
      });
    return () => {
      active = false;
    };
  }, [listingId, checked]);

  const handleToggle = async () => {
    setIsLoading(true);
    const wasSaved = saved;
    setSaved(!wasSaved); // optimistic
    try {
      if (wasSaved) {
        await removeListingFromWishlist(listingId);
      } else {
        await addListingToWishlist(listingId);
      }
    } catch {
      setSaved(wasSaved); // revert on failure
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isLoading}
      aria-label={saved ? 'Remove from saved' : 'Save listing'}
      aria-pressed={saved}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition ${
        saved
          ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-400'
          : 'border-cream-300 bg-cream-50 text-forest-700 hover:border-forest-700/30 dark:border-forest-700 dark:bg-forest-800 dark:text-cream-100'
      } ${fullWidth ? 'w-full justify-center' : ''} ${className} dark:border-cream-100/30 dark:border-cream-100`}
    >
      <HeartIcon className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
      {showLabel && (saved ? 'Saved' : 'Save')}
    </button>
  );
}
