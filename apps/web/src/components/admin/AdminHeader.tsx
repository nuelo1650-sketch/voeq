'use client';

import { type ReactNode } from 'react';

export function AdminHeader({ title, actions }: { title: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">{title}</h1>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}
