import { cn } from '@/lib/utils';
import { IconProps } from '@/components/icons/icon-types';

export function ElectricalIcon({ className, 'aria-label': ariaLabel }: IconProps) {
  return (
    <svg className={cn(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-label={ariaLabel} aria-hidden={!ariaLabel}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
