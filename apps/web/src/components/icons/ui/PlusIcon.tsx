import { cn } from '@/lib/utils';

interface IconProps {
  className?: string;
  'aria-label'?: string;
}

export function PlusIcon({ className, 'aria-label': ariaLabel }: IconProps) {
  return (
    <svg
      className={cn(className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
