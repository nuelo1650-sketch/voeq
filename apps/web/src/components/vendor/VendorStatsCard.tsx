import { cn } from '@/lib/utils';

interface VendorStatsCardProps {
  label: string;
  value: string | number;
  className?: string;
}

export function VendorStatsCard({ label, value, className }: VendorStatsCardProps) {
  return (
    <div className={cn('rounded-2xl border border-cream-300 bg-cream-50 p-4 dark:border-forest-700 dark:bg-forest-800', className)}>
      <p className="text-xs uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">{label}</p>
      <p className="mt-1 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">{value}</p>
    </div>
  );
}
