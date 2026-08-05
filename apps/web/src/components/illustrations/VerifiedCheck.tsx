import { cn } from '@/lib/utils';

interface IllustrationProps {
  className?: string;
}

export function VerifiedCheck({ className }: IllustrationProps) {
  return (
    <svg className={cn(className)} viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Verified">
      <path d="M40 100l40 40 80-80" />
      <circle cx="100" cy="100" r="70" opacity="0.3" />
    </svg>
  );
}
