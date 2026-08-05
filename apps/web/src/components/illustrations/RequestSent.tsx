import { cn } from '@/lib/utils';

interface IllustrationProps {
  className?: string;
}

export function RequestSent({ className }: IllustrationProps) {
  return (
    <svg className={cn(className)} viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Request sent">
      <path d="M60 140l100-80-40 20-20-20 20-20-40 20z" opacity="0.5" />
      <path d="M100 60v40l30 20" />
    </svg>
  );
}
