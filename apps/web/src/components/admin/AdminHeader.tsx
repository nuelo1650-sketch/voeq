'use client';

import { type ReactNode } from 'react';

export function AdminHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <h1 className="font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">{title}</h1>
        {description ? (
          <p className="text-sm text-forest-700/60 dark:text-cream-100/60">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}
