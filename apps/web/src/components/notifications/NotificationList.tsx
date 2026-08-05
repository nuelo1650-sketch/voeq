'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { NotificationItem } from '@/components/notifications/NotificationItem';

interface NotificationListProps {
  fetchNotifications: () => Promise<Array<{ id: string; title: string; body?: string; read: boolean; createdAt: string }>>;
  emptyMessage?: string;
  actions?: (item: { id: string; title: string; body?: string; read: boolean; createdAt: string }) => ReactNode;
}

export function NotificationList({ fetchNotifications, emptyMessage = 'No notifications yet.', actions }: NotificationListProps) {
  const [items, setItems] = useState<Array<{ id: string; title: string; body?: string; read: boolean; createdAt: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchNotifications()
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchNotifications]);

  if (loading) return <p className="text-sm text-forest-700/80 dark:text-cream-100/80">Loading notifications...</p>;
  if (!items.length) return <p className="text-sm text-forest-700/80 dark:text-cream-100/80">{emptyMessage}</p>;

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <NotificationItem key={item.id} title={item.title} body={item.body} timestamp={item.createdAt} read={item.read} actions={actions?.(item)} />
      ))}
    </div>
  );
}
