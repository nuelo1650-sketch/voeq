import { cn } from '@/lib/utils';

interface IllustrationProps {
  className?: string;
}

export function ComingSoon({ className }: IllustrationProps) {
  return (
    <svg className={cn(className)} viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Coming soon">
      <circle cx="100" cy="100" r="60" />
      <path d="M100 60v40l20 20" />
    </svg>
  );
}
