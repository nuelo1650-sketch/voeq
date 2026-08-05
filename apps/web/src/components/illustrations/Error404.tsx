import { cn } from '@/lib/utils';

interface IllustrationProps {
  className?: string;
}

export function Error404({ className }: IllustrationProps) {
  return (
    <svg className={cn(className)} viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="404 error">
      <circle cx="100" cy="100" r="60" />
      <path d="M70 70l60 60M130 70l-60 60" />
    </svg>
  );
}
