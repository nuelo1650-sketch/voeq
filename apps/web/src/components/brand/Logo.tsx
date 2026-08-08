import { cn } from '@/lib/utils';

type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

interface LogoProps {
  size?: LogoSize;
  className?: string;
}

const sizeMap: Record<LogoSize, { width: number; height: number }> = {
  sm: { width: 80, height: 24 },
  md: { width: 100, height: 30 },
  lg: { width: 120, height: 36 },
  xl: { width: 160, height: 48 },
};

export function Logo({ size = 'md', className }: LogoProps) {
  const { width, height } = sizeMap[size];

  return (
    <img
      src="/Name.jpg"
      alt="Logo"
      width={width}
      height={height}
      className={cn('inline-block object-contain', className)}
      loading="eager"
      decoding="async"
    />
  );
}
