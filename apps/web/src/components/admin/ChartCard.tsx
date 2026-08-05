import { type ReactNode } from 'react';

export function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-cream-300 bg-cream-50 p-6 dark:border-forest-700 dark:bg-forest-800">
      <h3 className="mb-4 text-sm font-semibold text-forest-900 dark:text-cream-100">{title}</h3>
      {children}
    </div>
  );
}
