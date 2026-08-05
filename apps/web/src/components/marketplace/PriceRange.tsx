import { cn } from '@/lib/utils';

interface PriceRangeProps {
  min: number;
  max: number | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PriceRange({ min, max, className, size = 'md' }: PriceRangeProps) {
  const formatPrice = (n: number) => `₦${n.toLocaleString('en-NG')}`;
  const text = max && max !== min ? `${formatPrice(min)} – ${formatPrice(max)}` : formatPrice(min);

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl font-semibold',
  };

  return (
    <span className={cn('font-semibold text-forest-900 dark:text-cream-100', sizeClasses[size], className)}>
      {text}
    </span>
  );
}
