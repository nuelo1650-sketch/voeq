import { cn } from '@/lib/utils';

type LogoSize = 'sm' | 'md' | 'lg' | 'xl';
type LogoTone = 'auto' | 'light' | 'dark';

interface LogoProps {
  size?: LogoSize;
  tone?: LogoTone;
  className?: string;
}

// Bigger, responsive logo. Desktop caps at h-20 (80px); mobile steps down.
const heightClass: Record<LogoSize, string> = {
  sm: 'h-11 sm:h-12',
  md: 'h-12 sm:h-16',
  lg: 'h-14 sm:h-20',
  xl: 'h-16 sm:h-24',
};

/**
 * Renders the Voeq wordmark (Name.png: a LIGHT/cream wordmark on transparent).
 * Because the asset is light, we invert it to dark on light backgrounds and
 * leave it light on dark backgrounds — so it's visible in both themes.
 * One asset, no swap, no white box.
 */
export function Logo({ size = 'md', tone = 'auto', className }: LogoProps) {
  const invert =
    tone === 'dark'
      ? 'invert' // light background → invert cream to dark
      : tone === 'light'
        ? '' // dark background → keep cream (visible on dark green)
        : 'invert dark:invert-0'; // auto: dark in light mode, cream in dark mode

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
