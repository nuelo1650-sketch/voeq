import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-shimmer rounded-md bg-gradient-to-r from-cream-200 via-cream-100 to-cream-200 bg-[length:200%_100%]',
        'dark:from-forest-700 dark:via-forest-800 dark:to-forest-700',
        className,
      )}
    />
  );
}
