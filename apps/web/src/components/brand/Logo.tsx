import { cn } from '@/lib/utils';

type LogoSize = 'sm' | 'md' | 'lg' | 'xl';
type LogoTone = 'auto' | 'light' | 'dark';

interface LogoProps {
  size?: LogoSize;
  tone?: LogoTone;
  className?: string;
}

const heightClass: Record<LogoSize, string> = {
  sm: 'h-7',
  md: 'h-8',
  lg: 'h-9',
  xl: 'h-11',
};

const toneClass: Record<LogoTone, string> = {
  auto: 'text-forest-900 dark:text-cream-100',
  light: 'text-cream-100',
  dark: 'text-forest-900',
};

export function Logo({ size = 'md', tone = 'auto', className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 415 175"
      role="img"
      aria-label="Voeq"
      className={cn('w-auto object-contain', heightClass[size], toneClass[tone], className)}
    >
      <g fill="none" stroke="currentColor" strokeWidth={20} strokeLinecap="round" strokeLinejoin="round">
        <path d="M25 35 L65 130 L105 35" />
        <circle cx="155" cy="82" r="40" />
        <path d="M287.1 67 A40 40 0 1 1 287.1 97" />
        <line x1="214" y1="82" x2="287" y2="82" />
        <circle cx="345" cy="82" r="40" />
      </g>
      <path d="M335 118 L355 118 L395 168 L375 148 Z" fill="currentColor" stroke="none" />
    </svg>
  );
}
