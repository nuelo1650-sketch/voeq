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
    <picture className={cn('inline-block', className)}>
      <source srcSet="/brand/voeq-wordmark-dark.svg" media="(prefers-color-scheme: dark)" />
      <img
        src="/brand/voeq-wordmark.svg"
        alt="Voeq"
        width={width}
        height={height}
        loading="eager"
        decoding="async"
      />
    </picture>
  );
}
