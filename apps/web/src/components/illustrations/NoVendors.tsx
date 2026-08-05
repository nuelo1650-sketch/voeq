import { cn } from '@/lib/utils';

interface IllustrationProps {
  className?: string;
}

export function NoVendors({ className }: IllustrationProps) {
  return (
    <svg className={cn(className)} viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="No vendors">
      <path d="M40 170h120" />
      <path d="M60 170V80l60-40v90" />
      <path d="M90 40h20v40H90z" opacity="0.4" />
      <path d="M100 130h40" />
    </svg>
  );
}
