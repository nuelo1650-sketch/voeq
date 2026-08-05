import { cn } from '@/lib/utils';

interface IllustrationProps {
  className?: string;
}

export function Success({ className }: IllustrationProps) {
  return (
    <svg className={cn(className)} viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Success">
      <path d="M60 100l30 30 60-70" />
      <circle cx="100" cy="100" r="70" opacity="0.3" />
    </svg>
  );
}
