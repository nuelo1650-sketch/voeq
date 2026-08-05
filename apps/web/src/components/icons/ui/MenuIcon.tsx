import { cn } from '@/lib/utils';

interface IconProps {
  className?: string;
  'aria-label'?: string;
}

export function MenuIcon({ className, 'aria-label': ariaLabel }: IconProps) {
  return (
    <svg className={cn(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-label={ariaLabel} aria-hidden={!ariaLabel}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}
