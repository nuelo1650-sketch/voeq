import { StarIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

export function RatingStars({ rating, count, size = 'md', showCount = true, className }: RatingStarsProps) {
  const sizeMap = {
    sm: { star: 'h-3.5 w-3.5', text: 'text-xs' },
    md: { star: 'h-4 w-4', text: 'text-sm' },
    lg: { star: 'h-5 w-5', text: 'text-base' },
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={cn(sizeMap[size].star, star <= Math.round(rating) ? 'text-gold-600' : 'text-forest-700/20 dark:text-cream-100/20')}
            filled={star <= Math.round(rating)}
          />
        ))}
      </div>
      {showCount && (
        <span className={cn('font-medium text-forest-900 dark:text-cream-100', sizeMap[size].text)}>
          {rating.toFixed(1)}
          {count !== undefined && (
            <span className="ml-1 text-forest-700/60 dark:text-cream-100/60">({count})</span>
          )}
        </span>
      )}
    </div>
  );
}
