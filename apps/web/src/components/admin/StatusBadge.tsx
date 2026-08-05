import { cn } from '@/lib/chart-utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles: Record<string, string> = {
    active: 'bg-green-500/10 text-green-700',
    suspended: 'bg-red-500/10 text-red-700',
    pending_review: 'bg-yellow-500/10 text-yellow-700',
    live: 'bg-green-500/10 text-green-700',
    incomplete: 'bg-cream-200 text-forest-700',
    resolved: 'bg-blue-500/10 text-blue-700',
    open: 'bg-red-500/10 text-red-700',
    approved: 'bg-green-500/10 text-green-700',
    rejected: 'bg-red-500/10 text-red-700',
  };

  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', styles[status] ?? 'bg-cream-200 text-forest-700', className)}>
      {status}
    </span>
  );
}
