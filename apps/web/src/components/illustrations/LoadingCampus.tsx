import { cn } from '@/lib/utils';

interface IllustrationProps {
  className?: string;
}

export function LoadingCampus({ className }: IllustrationProps) {
  return (
    <svg className={cn(className)} viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Loading">
      <path d="M40 170h120" />
      <path d="M60 170V100l60-40v40" />
      <path d="M40 100h120" />
      <path d="M90 40h20v30H90z" opacity="0.4" />
    </svg>
  );
}
