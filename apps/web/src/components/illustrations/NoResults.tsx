import { cn } from '@/lib/utils';

interface IllustrationProps {
  className?: string;
}

export function NoResults({ className }: IllustrationProps) {
  return (
    <svg className={cn(className)} viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="No results">
      <rect x="40" y="50" width="120" height="90" rx="8" />
      <path d="M70 90h60M70 110h40" opacity="0.4" />
    </svg>
  );
}
