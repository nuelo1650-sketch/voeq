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
 * Renders the Voeq wordmark (Name.png). Dark logo on light backgrounds,
 * white logo on dark ones — so it stays visible in navbars and dark footers.
 */
export function Logo({ size = 'md', tone = 'auto', className }: LogoProps) {
  const cls = cn('w-auto object-contain', heightClass[size], className);

  if (tone === 'light') {
    // Rendered on a dark background → use white logo.
    return <img src="/Name-white.png" alt="Voeq" width={240} height={160} className={cls} />;
  }
  if (tone === 'dark') {
    // Rendered on a light background → use dark logo.
    return <img src="/Name.png" alt="Voeq" width={240} height={160} className={cls} />;
  }

  // auto: show dark on light mode, white on dark mode.
  return (
    <>
      <img src="/Name.png" alt="Voeq" width={240} height={160} className={cn(cls, 'dark:hidden')} />
      <img src="/Name-white.png" alt="Voeq" width={240} height={160} className={cn(cls, 'hidden dark:block')} />
    </>
  );
}
