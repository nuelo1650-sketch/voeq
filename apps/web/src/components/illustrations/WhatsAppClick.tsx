import { cn } from '@/lib/utils';

interface IllustrationProps {
  className?: string;
}

export function WhatsAppClick({ className }: IllustrationProps) {
  return (
    <svg className={cn(className)} viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="WhatsApp">
      <path d="M40 130l30-30 20 20 40-40 30 30" opacity="0.3" />
      <circle cx="140" cy="60" r="40" />
      <path d="M125 70h10v10h-10z" opacity="0.4" />
    </svg>
  );
}
