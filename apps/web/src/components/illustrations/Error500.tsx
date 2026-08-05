import { cn } from '@/lib/utils';

interface IllustrationProps {
  className?: string;
}

export function Error500({ className }: IllustrationProps) {
  return (
    <svg className={cn(className)} viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="500 error">
      <circle cx="100" cy="100" r="60" />
      <path d="M80 80l40 40M120 80l-40 40" opacity="0.6" />
      <circle cx="100" cy="100" r="20" />
    </svg>
  );
}
