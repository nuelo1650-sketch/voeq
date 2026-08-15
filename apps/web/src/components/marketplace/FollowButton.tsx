'use client';

import { useState } from 'react';
import { followVendor, unfollowVendor } from '@/lib/marketplace-client';
import { CheckIcon, PlusIcon } from '@/components/icons';

interface FollowButtonProps {
  vendorId: string;
  initialIsFollowing?: boolean;
  className?: string;
}

export function FollowButton({ vendorId, initialIsFollowing = false, className }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      if (isFollowing) {
        await unfollowVendor(vendorId);
        setIsFollowing(false);
      } else {
        await followVendor(vendorId);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Follow toggle failed', error);
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
        isFollowing
          ? 'border-forest-700 bg-forest-700 text-cream-100'
          : 'border-cream-300 bg-cream-50 text-forest-700 hover:border-forest-700/30 dark:border-forest-700 dark:bg-forest-800 dark:text-cream-100'
      } ${className} dark:border-cream-100 dark:border-cream-100/30`}
      aria-label={isFollowing ? 'Unfollow' : 'Follow'}
    >
      {isFollowing ? <CheckIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  );
}
