import { cn } from '@/lib/utils';

interface IconProps {
  className?: string;
  'aria-label'?: string;
}

export function ArrowRightIcon({ className, 'aria-label': ariaLabel }: IconProps) {
  return (
    <svg className={cn(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-label={ariaLabel} aria-hidden={!ariaLabel}>
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}
