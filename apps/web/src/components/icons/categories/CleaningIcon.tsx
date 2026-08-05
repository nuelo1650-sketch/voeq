import { cn } from '@/lib/utils';

interface IconProps {
  className?: string;
  'aria-label'?: string;
}

export function CleaningIcon({ className, 'aria-label': ariaLabel }: IconProps) {
  return (
    <svg className={cn(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-label={ariaLabel} aria-hidden={!ariaLabel}>
      <path d="M19 11h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      <path d="M12 11v6M8 14h8" />
    </svg>
  );
}
