import { cn } from '@/lib/utils';

interface IllustrationProps {
  className?: string;
}

export function NoReviews({ className }: IllustrationProps) {
  return (
    <svg className={cn(className)} viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="No reviews">
      <path d="M40 130h120" opacity="0.3" />
      <path d="M60 110h80" opacity="0.3" />
      <circle cx="100" cy="70" r="30" />
    </svg>
  );
}
