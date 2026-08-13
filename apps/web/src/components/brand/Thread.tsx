import { cn } from '@/lib/utils';

/**
 * The Thread — Voeq's signature connection motif.
 * A single continuous gold line representing the connection between a
 * student and a campus vendor. Used as a seam, a divider, and a progress
 * indicator so the whole product reads as one woven system.
 *
 * Variants:
 *  - 'seam'    : short horizontal gold hairline with a soft glow (section dividers)
 *  - 'line'    : full-width thin thread (under headers / between blocks)
 *  - 'progress': a thread that fills gold from 0→100% (OTP / onboarding)
 */

export function ThreadSeam({ className }: { className?: string }) {
  return (
    <div className={cn('relative h-px w-24 overflow-hidden', className)}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-500/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-gold-500/0 via-gold-500/40 to-gold-500/0 blur-[1px]" />
    </div>
  );
}

export function ThreadLine({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'h-px w-full bg-gradient-to-r from-gold-500/0 via-gold-500/30 to-gold-500/0',
        className,
      )}
    />
  );
}

export function ThreadProgress({
  progress,
  className,
}: {
  progress: number;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, progress));
  return (
    <div className={cn('relative h-1 w-full overflow-hidden rounded-full bg-cream-200/70 dark:bg-forest-700', className)}>
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-gold-500/80 via-gold-500 to-gold-400 transition-all duration-700 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
