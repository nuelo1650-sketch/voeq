import { cn } from '@/lib/utils';
import Image from 'next/image';

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  xs: { h: 24, w: 24, text: 'text-xs' },
  sm: { h: 32, w: 32, text: 'text-sm' },
  md: { h: 40, w: 40, text: 'text-base' },
  lg: { h: 48, w: 48, text: 'text-lg' },
  xl: { h: 64, w: 64, text: 'text-xl' },
} as const;

export function Avatar({ src, alt, size = 'md', className }: AvatarProps) {
  const initials = alt
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (src) {
    const dims = sizeMap[size];
    return (
      <Image
        src={src}
        alt={alt}
        width={dims.w}
        height={dims.h}
        className={cn('rounded-full object-cover', className)}
      />
    );
  }

  const dims = sizeMap[size];
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-forest-700 font-medium text-cream-100',
        dims.text,
        className,
      )}
      aria-label={alt}
      style={{ width: dims.w, height: dims.h }}
    >
      {initials || '?'}
    </div>
  );
}
