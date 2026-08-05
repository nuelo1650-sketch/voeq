import { cn } from '@/lib/utils';

interface IllustrationProps {
  className?: string;
}

export function GenericEmpty({ className }: IllustrationProps) {
  return (
    <svg className={cn(className)} viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Empty">
      <circle cx="70" cy="70" r="30" opacity="0.4" />
      <circle cx="130" cy="130" r="40" opacity="0.2" />
      <path d="M40 170h120" opacity="0.3" />
    </svg>
  );
}
