'use client';

import { type ReactNode } from 'react';

interface NotificationItemProps {
  title: string;
  body?: string;
  timestamp: string;
  read?: boolean;
  actions?: ReactNode;
}

export function NotificationItem({ title, body, timestamp, read, actions }: NotificationItemProps) {
  return (
    <div className={`rounded-xl border border-cream-300 p-3 dark:border-forest-700 ${read ? 'bg-cream-50 dark:bg-forest-800' : 'bg-white dark:bg-forest-900'} dark:border-cream-100`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-forest-900 dark:text-cream-100">{title}</p>
          {body ? <p className="mt-1 text-sm text-forest-700/80 dark:text-cream-100/80">{body}</p> : null}
          <p className="mt-2 text-xs text-forest-700/60 dark:text-cream-100/60">{new Date(timestamp).toLocaleString()}</p>
        </div>
        {actions}
      </div>
    </div>
  );
}
