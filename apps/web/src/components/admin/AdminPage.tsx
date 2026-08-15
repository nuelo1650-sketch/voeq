import { type ReactNode } from 'react';
import { AdminHeader } from './AdminHeader';
import { ThreadSeam } from '@/components/brand/Thread';

export function AdminPage({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-7xl animate-fade-in space-y-6 px-1">
      <div>
        <AdminHeader title={title} description={description} actions={actions} />
        <ThreadSeam className="mt-3" />
      </div>
      {children}
    </div>
  );
}

export function AdminTable({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-cream-200 shadow-sm dark:border-forest-700 dark:border-cream-100">
      <table className="w-full text-left text-sm">{children}</table>
    </div>
  );
}

export function AdminTh({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <th
      className={`border-b border-cream-200 bg-cream-100/60 px-4 py-3 text-xs font-medium uppercase tracking-wide text-forest-700/60 dark:border-forest-700 dark:bg-forest-900/40 dark:text-cream-100/60 ${className ?? ''} dark:bg-forest-900/60 dark:border-cream-100`}
    >
      {children}
    </th>
  );
}

export function AdminEmpty({ children }: { children: ReactNode }) {
  return (
    <tr>
      <td colSpan={99} className="px-4 py-14 text-center">
        <p className="text-sm text-forest-700/50 dark:text-cream-100/50">{children}</p>
      </td>
    </tr>
  );
}
