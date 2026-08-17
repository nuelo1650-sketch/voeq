import { cn } from '@/lib/utils';

interface ProgressMeterProps {
  progress: number;
  /** number of pill segments (one per onboarding step) */
  segments?: number;
  className?: string;
  showLabel?: boolean;
}

/**
 * Pill-segmented progress bar. One rounded-full segment per step; filled
 * segments show completion, the active segment shows partial fill. Matches the
 * app's pill motif (buttons/inputs are rounded-full).
 */
export function ProgressMeter({ progress, segments = 4, className, showLabel = true }: ProgressMeterProps) {
  const clamped = Math.max(0, Math.min(100, progress));
  const filled = clamped / 100; // 0..1 of total

  return (
    <div className={className}>
      {showLabel && (
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-forest-900 dark:text-cream-100">Setup progress</span>
          <span className="font-semibold text-forest-700 dark:text-cream-100">{clamped}%</span>
        </div>
      )}
      <div className="flex gap-1.5">
        {Array.from({ length: segments }).map((_, i) => {
          const segStart = i / segments;
          const segEnd = (i + 1) / segments;
          const local = Math.max(0, Math.min(1, (filled - segStart) / (segEnd - segStart)));
          const done = local >= 1;
          return (
            <div
              key={i}
              className="h-2 flex-1 overflow-hidden rounded-full bg-cream-200 dark:bg-forest-700"
            >
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-700 ease-out',
                  done ? 'bg-gradient-to-r from-forest-700 to-gold-500' : 'bg-gradient-to-r from-forest-700 to-gold-500',
                )}
                style={{ width: `${local * 100}%` }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
