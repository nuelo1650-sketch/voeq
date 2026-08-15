'use client';

import { useState } from 'react';
import { HeartIcon } from '@/components/icons';
import { addToWishlist, removeFromWishlist } from '@/lib/marketplace-client';

interface WishlistButtonProps {
  vendorId: string;
  initialIsWishlisted?: boolean;
  className?: string;
}

export function WishlistButton({ vendorId, initialIsWishlisted = false, className }: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      if (isWishlisted) {
        await removeFromWishlist(vendorId);
        setIsWishlisted(false);
      } else {
        await addToWishlist(vendorId);
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error('Wishlist toggle failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isLoading}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
        isWishlisted
          ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-400'
          : 'border-cream-300 bg-cream-50 text-forest-700 hover:border-forest-700/30 dark:border-forest-700 dark:bg-forest-800 dark:text-cream-100'
      } ${className} dark:border-cream-100/30 dark:border-cream-100`}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <HeartIcon className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
      {isWishlisted ? 'Saved' : 'Save'}
    </button>
  );
}
