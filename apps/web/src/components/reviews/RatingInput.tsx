'use client';

import { useState } from 'react';
import { StarIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

interface RatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  error?: string;
}

export function RatingInput({ value, onChange, size = 'lg', error }: RatingInputProps) {
  const [hover, setHover] = useState(0);

  const sizeMap = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  return (
    <div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 rounded"
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            <StarIcon
              className={cn(
                sizeMap[size],
                (hover || value) >= star ? 'text-gold-600' : 'text-forest-700/20 dark:text-cream-100/20',
              )}
              filled={(hover || value) >= star}
            />
          </button>
        ))}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
