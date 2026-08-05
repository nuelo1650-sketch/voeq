import { cn } from '@/lib/utils';

interface IconProps {
  className?: string;
  'aria-label'?: string;
}

export function FoodIcon({ className, 'aria-label': ariaLabel }: IconProps) {
  return (
    <svg className={cn(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-label={ariaLabel} aria-hidden={!ariaLabel}>
      <path d="M3 2v7c0 1.1.9 2 2 2h0a2 2 0 0 0 2-2V2" />
      <path d="M5 2v20" />
      <path d="M19 2c-1.66 0-3 2.69-3 6 0 2.21.6 4.13 1.5 5.13L17 22" />
    </svg>
  );
}
