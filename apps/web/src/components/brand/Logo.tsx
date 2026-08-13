import { cn } from '@/lib/utils';

type LogoSize = 'sm' | 'md' | 'lg' | 'xl';
type LogoTone = 'auto' | 'light' | 'dark';

interface LogoProps {
  size?: LogoSize;
  tone?: LogoTone;
  className?: string;
}

// Bigger, responsive logo. Desktop caps at h-16 (64px); mobile steps down.
const heightClass: Record<LogoSize, string> = {
  sm: 'h-10 sm:h-12',
  md: 'h-11 sm:h-14',
  lg: 'h-12 sm:h-16',
  xl: 'h-14 sm:h-20',
};

/**
 * Renders the Voeq wordmark (Name.png: black text on transparent).
 * Name.png is black, so we invert it to white on dark backgrounds via CSS.
 * This keeps a single asset (no swap, no white box) and stays crisp at any size.
 */
export function Logo({ size = 'md', tone = 'auto', className }: LogoProps) {
  const invert =
    tone === 'light'
      ? 'invert' // always on a dark background
      : tone === 'dark'
        ? '' // light background, keep black
        : 'dark:invert'; // auto: invert only in dark mode

  return (
    <img
      src="/Name.png"
      alt="Voeq"
      width={240}
      height={160}
      className={cn('w-auto object-contain', heightClass[size], invert, className)}
    />
  );
}
