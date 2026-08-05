import Link from 'next/link';
import { cn } from '@/lib/chart-utils';

interface KPICardProps {
  label: string;
  value: number;
  subValue?: string;
  delta?: number;
  deltaLabel?: string;
  href?: string;
  className?: string;
}

export function KPICard({ label, value, subValue, delta, deltaLabel, href, className }: KPICardProps) {
  const content = (
    <div className={cn('rounded-2xl border border-cream-300 bg-cream-50 p-4 dark:border-forest-700 dark:bg-forest-800', href && 'transition hover:border-forest-700/30', className)}>
      <p className="text-xs uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">{label}</p>
      <p className="mt-1 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">{value.toLocaleString()}</p>
      {delta !== undefined && (
        <p className="mt-1 text-xs text-forest-700/60 dark:text-cream-100/60">+{delta} {deltaLabel}</p>
      )}
      {subValue && <p className="mt-1 text-xs text-forest-700/60 dark:text-cream-100/60">{subValue}</p>}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}
