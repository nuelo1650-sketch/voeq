import { cn } from '@/lib/utils';

interface IllustrationProps {
  className?: string;
}

export function EmptySearch({ className }: IllustrationProps) {
  return (
    <svg className={cn(className)} viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="No search results">
      <circle cx="85" cy="85" r="50" />
      <path d="m122 122 30 30" />
      <path d="M85 65v40M65 85h40" opacity="0.3" />
    </svg>
  );
}
