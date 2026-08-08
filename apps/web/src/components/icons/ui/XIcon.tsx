import { IconProps } from '@/components/icons/categories';

export function XIcon({ className, 'aria-label': ariaLabel }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-label={ariaLabel}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
