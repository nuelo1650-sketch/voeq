import { cn } from '@/lib/utils';

interface IllustrationProps {
  className?: string;
}

export function WelcomeHero({ className }: IllustrationProps) {
  return (
    <svg className={cn(className)} viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Welcome">
      <path d="M40 170h120" />
      <path d="M60 170V100h80v70" opacity="0.3" />
      <path d="M100 40v60M60 100h80" />
    </svg>
  );
}
