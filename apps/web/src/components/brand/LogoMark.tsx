import { cn } from '@/lib/utils';

type LogoMarkSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface LogoMarkProps {
  size?: LogoMarkSize;
  className?: string;
}

const sizeMap: Record<LogoMarkSize, number> = {
  xs: 16,
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64,
};

export function LogoMark({ size = 'md', className }: LogoMarkProps) {
  const pixelSize = sizeMap[size];

  return (
    <picture className={cn('inline-block', className)}>
      <source srcSet="/brand/voeq-mark.svg" />
      <img
        src="/brand/voeq-mark.svg"
        alt="Voeq"
        width={pixelSize}
        height={pixelSize}
        loading="eager"
        decoding="async"
        className="dark:invert"
      />
    </picture>
  );
}
