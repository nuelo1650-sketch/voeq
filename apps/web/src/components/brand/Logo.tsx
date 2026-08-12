'use client';

import { useTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';

type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

interface LogoProps {
  size?: LogoSize;
  className?: string;
}

const sizeMap: Record<LogoSize, { width: number; height: number }> = {
  sm: { width: 110, height: 26 },
  md: { width: 150, height: 36 },
  lg: { width: 190, height: 46 },
  xl: { width: 240, height: 58 },
};

export function Logo({ size = 'md', className }: LogoProps) {
  const { theme } = useTheme();
  const { width, height } = sizeMap[size];
  const src = theme === 'dark' ? '/brand/voeq-wordmark-dark.svg' : '/brand/voeq-wordmark.svg';

  return (
    <img
      src={src}
      alt="Voeq"
      width={width}
      height={height}
      className={cn('object-contain', className)}
    />
  );
}
