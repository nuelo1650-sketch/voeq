'use client';

import { cn } from '@/lib/utils';
import { BADGE_DEFINITIONS } from '@/lib/badge-client';

interface BadgeIconProps {
  badgeKey: string;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  className?: string;
}

const SIZE_MAP = {
  sm: { icon: 'h-5 w-5', container: 'h-8 w-8' },
  md: { icon: 'h-6 w-6', container: 'h-10 w-10' },
  lg: { icon: 'h-8 w-8', container: 'h-14 w-14' },
};

export function BadgeIcon({ badgeKey, size = 'md', showTooltip = true, className }: BadgeIconProps) {
  const definition = BADGE_DEFINITIONS[badgeKey as keyof typeof BADGE_DEFINITIONS];
  if (!definition) return null;

  const { icon, label, description, color } = definition;
  const sizes = SIZE_MAP[size];

  return (
    <div
      className={cn(
        'group relative flex flex-col items-center gap-1',
        className,
      )}
      title={showTooltip ? `${label}: ${description}` : undefined}
    >
      <div className={cn(
        'flex items-center justify-center rounded-full bg-gold-500/10 ring-2 ring-gold-500/30',
        sizes.container,
      )}>
        <BadgeIconSvg name={icon} className={cn(sizes.icon, color)} />
      </div>
      {showTooltip && (
        <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-48 -translate-x-1/2 rounded-lg bg-forest-900 px-3 py-2 text-xs text-cream-100 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
          <p className="font-semibold">{label}</p>
          <p className="mt-0.5 text-cream-100/80">{description}</p>
        </div>
      )}
    </div>
  );
}

function BadgeIconSvg({ name, className }: { name: string; className?: string }) {
  const icons: Record<string, JSX.Element> = {
    sprout: <path d="M12 22v-8M12 14c0-3 2-6 6-6-1 4-3 6-6 6zm0 0c0-3-2-6-6-6 1 4 3 6 6 6z" />,
    star: <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
    'shield-check': <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4" />,
    'chat-bubble': <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
    'trending-up': <path d="m22 7-8.5 8.5-5-5L2 17M16 7h6v6" />,
    trophy: <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 22V12a2 2 0 0 1 2-2 2 2 0 0 1 2 2v10M8 6h8v3a4 4 0 0 1-8 0V6z" />,
    grid: <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />,
    award: <circle cx="12" cy="8" r="6M8.21 13.89L7 22l5-3 5 3-1.21-8.12" />,
  };

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name] ?? icons.star}
    </svg>
  );
}
