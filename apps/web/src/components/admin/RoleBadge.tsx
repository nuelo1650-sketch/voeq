import { cn } from '@/lib/chart-utils';

interface RoleBadgeProps {
  role: string;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const styles: Record<string, string> = {
    super_admin: 'bg-gold-500/10 text-gold-700',
    admin: 'bg-forest-700/10 text-forest-700',
    vendor: 'bg-blue-500/10 text-blue-700',
    buyer: 'bg-cream-200 text-forest-700',
  };

  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', styles[role] ?? 'bg-cream-200 text-forest-700', className)}>
      {role}
    </span>
  );
}
