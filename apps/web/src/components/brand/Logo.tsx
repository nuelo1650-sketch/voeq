import { cn } from '@/lib/utils';

type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

interface LogoProps {
  size?: LogoSize;
  className?: string;
}

const heightClass: Record<LogoSize, string> = {
  sm: 'h-7',
  md: 'h-8',
  lg: 'h-9',
  xl: 'h-11',
};

export function Logo({ size = 'md', className }: LogoProps) {
  return (
    <img
      src="/Name.png"
      alt="Voeq"
      className={cn('w-auto object-contain', heightClass[size], className)}
    />
  );
}
