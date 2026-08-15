import { BadgeIcon } from './BadgeIcon';
import type { VendorBadge } from '@/lib/badge-client';

interface BadgeListProps {
  badges: VendorBadge[];
  size?: 'sm' | 'md' | 'lg';
  max?: number;
  className?: string;
}

export function BadgeList({ badges, size = 'md', max = 8, className }: BadgeListProps) {
  const visible = badges.slice(0, max);
  const remaining = badges.length - max;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className ?? ''}`}>
      {visible.map((badge) => (
        <BadgeIcon key={badge.id} badgeKey={badge.badgeKey} size={size} />
      ))}
      {remaining > 0 && (
        <div className={`flex items-center justify-center rounded-full bg-cream-200 text-xs font-semibold text-forest-700 ${
          size === 'sm' ? 'h-8 w-8' : size === 'md' ? 'h-10 w-10' : 'h-14 w-14'
        } dark:bg-forest-700 dark:text-cream-100`}>
          +{remaining}
        </div>
      )}
    </div>
  );
}
