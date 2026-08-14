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
    <div className="space-y-6">
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
    <div className="overflow-hidden rounded-2xl border border-cream-300 bg-cream-50 shadow-sm dark:border-forest-700 dark:bg-forest-800">
      <table className="w-full text-left text-sm">{children}</table>
    </div>
  );
}

export function AdminTh({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <th
      className={`border-b border-cream-200 px-4 py-3 text-xs font-medium uppercase tracking-wide text-forest-700/60 dark:border-forest-700 dark:text-cream-100/60 ${className ?? ''}`}
    >
      {children}
    </th>
  );
}

export function AdminEmpty({ children }: { children: ReactNode }) {
  return (
    <tr>
      <td colSpan={99} className="px-4 py-10 text-center text-sm text-forest-700/60 dark:text-cream-100/60">
        {children}
      </td>
    </tr>
  );
}
