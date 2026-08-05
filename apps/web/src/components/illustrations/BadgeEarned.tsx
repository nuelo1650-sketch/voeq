import { cn } from '@/lib/utils';

interface IllustrationProps {
  className?: string;
}

export function BadgeEarned({ className }: IllustrationProps) {
  return (
    <svg className={cn(className)} viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Badge earned">
      <circle cx="100" cy="100" r="50" />
      <path d="M100 70v40l25 15" opacity="0.4" />
    </svg>
  );
}
