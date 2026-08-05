import { cn } from '@/lib/utils';

interface ProgressMeterProps {
  progress: number;
  className?: string;
  showLabel?: boolean;
}

export function ProgressMeter({ progress, className, showLabel = true }: ProgressMeterProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={className}>
      {showLabel && (
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-forest-900 dark:text-cream-100">
            Setup progress
          </span>
          <span className="font-semibold text-forest-700 dark:text-gold-500">
            {clampedProgress}%
          </span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-cream-200 dark:bg-forest-700">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            clampedProgress === 100 ? 'bg-gold-500' : 'bg-forest-700',
          )}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}
