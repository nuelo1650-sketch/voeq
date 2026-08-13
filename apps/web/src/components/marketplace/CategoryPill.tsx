'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Icons, OtherIcon } from '@/components/icons/categories';

interface CategoryPillProps {
  slug: string;
  name: string;
  iconName: string;
  active?: boolean;
  size?: 'sm' | 'md';
  onClick?: () => void;
  href?: string;
}

export function CategoryPill({ slug, name, iconName, active, size = 'md', onClick, href }: CategoryPillProps) {
  const Icon = Icons[iconName] ?? OtherIcon;

  const sizeClasses = size === 'sm' ? 'h-9 px-3 text-xs gap-1.5' : 'h-11 px-4 text-sm gap-2';
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  const className = cn(
    'inline-flex items-center justify-center rounded-full font-medium transition whitespace-nowrap',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2',
    active
      ? 'bg-gold-500 text-forest-900 border border-gold-500 shadow-sm shadow-gold-500/30'
      : 'bg-cream-100 text-forest-700 border border-cream-300 hover:border-forest-700/30 dark:bg-forest-800 dark:text-cream-100 dark:border-forest-700 hover:dark:border-gold-500/50',
    sizeClasses,
  );

  if (href) {
    return (
      <Link href={href as unknown as string} className={className}>
        {Icon && <Icon className={iconSize} />}
        <span>{name}</span>
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className} data-slug={slug}>
      {Icon && <Icon className={iconSize} />}
      <span>{name}</span>
    </button>
  );
}
