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
  const logoSize = height; // Make logo square based on height

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <img
        src="/Logo.png"
        alt="Logo"
        width={logoSize}
        height={logoSize}
        className="object-contain"
        loading="eager"
        decoding="async"
      />
      <img
        src="/Name.png"
        alt="Voeq"
        width={width}
        height={height}
        className="object-contain"
        loading="eager"
        decoding="async"
      />
    </div>
  );
}
