import { cn } from '@/lib/utils';
import { IconProps } from '@/components/icons/icon-types';

export function LogisticsIcon({ className, 'aria-label': ariaLabel }: IconProps) {
  return (
    <svg className={cn(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-label={ariaLabel} aria-hidden={!ariaLabel}>
      <rect x="1" y="6" width="14" height="11" rx="1" />
      <path d="M15 9h4l3 3v5h-7" />
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="19" r="2" />
    </svg>
  );
}
