import { cn } from '@/lib/utils';

type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

interface LogoProps {
  size?: LogoSize;
  className?: string;
}

const sizeMap: Record<LogoSize, { width: number; height: number }> = {
  sm: { width: 140, height: 42 },
  md: { width: 180, height: 54 },
  lg: { width: 220, height: 66 },
  xl: { width: 280, height: 84 },
};

export function Logo({ size = 'md', className }: LogoProps) {
  const { width, height } = sizeMap[size];

  return (
    <img
      src="/Name.png"
      alt="Voeq"
      width={width}
      height={height}
      className={cn('object-contain', className)}
      loading="eager"
      decoding="async"
    />
  );
}
