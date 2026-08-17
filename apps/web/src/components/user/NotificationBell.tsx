'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Bell, Check } from 'lucide-react';
import { getNotifications, markNotificationRead, markAllNotificationsRead, type NotificationItem } from '@/lib/notification-client';

function iconFor(type: NotificationItem['type']) {
  switch (type) {
    case 'new_follower':
      return '👤';
    case 'new_review':
      return '⭐';
    case 'review_response':
      return '💬';
    case 'badge_earned':
      return '🏅';
    case 'new_message':
      return '✉️';
  }
}

function titleFor(n: NotificationItem): string {
  const p = (n.payload ?? {}) as Record<string, string>;
  switch (n.type) {
    case 'new_follower':
      return `${p.followerName ?? 'Someone'} started following you`;
    case 'new_review':
      return `New review from ${p.reviewerName ?? 'a shopper'}`;
    case 'review_response':
      return `${p.vendorName ?? 'A vendor'} replied to your review`;
    case 'badge_earned':
      return `You earned the ${p.label ?? 'badge'} badge`;
    case 'new_message':
      return 'New message';
  }
}

function linkFor(n: NotificationItem): string {
  const p = (n.payload ?? {}) as Record<string, string>;
  switch (n.type) {
    case 'new_follower':
    case 'new_review':
    case 'review_response':
      return p.vendorId ? `/v/${p.vendorId}` : '/';
    case 'badge_earned':
      return '/vendor/profile';
    case 'new_message':
      return '/messages';
    default:
      return '/';
  }
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getNotifications();
      setItems(res.items);
      setUnread(res.unreadCount);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const onMarkRead = async (id: string) => {
    await markNotificationRead(id);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, readAt: new Date().toISOString() } : i)));
    setUnread((u) => Math.max(0, u - 1));
  };

  const onMarkAll = async () => {
    await markAllNotificationsRead();
    setItems((prev) => prev.map((i) => ({ ...i, readAt: new Date().toISOString() })));
    setUnread(0);
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-forest-700 hover:bg-cream-100 dark:text-cream-100 dark:hover:bg-forest-700"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-cream-200 bg-cream-50 shadow-xl dark:border-forest-700 dark:bg-forest-800 dark:border-cream-100">
          <div className="flex items-center justify-between border-b border-cream-200 px-4 py-3 dark:border-forest-700">
            <span className="text-sm font-semibold text-forest-900 dark:text-cream-100">Notifications</span>
            {unread > 0 && (
              <button
                onClick={onMarkAll}
                className="inline-flex items-center gap-1 text-xs font-medium text-gold-600 hover:text-gold-500 dark:text-gold-400"
              >
                <Check className="h-3.5 w-3.5" /> Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <p className="px-4 py-6 text-center text-sm text-forest-700/60 dark:text-cream-100/60">Loading…</p>
            ) : items.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-forest-700/60 dark:text-cream-100/60">You&apos;re all caught up.</p>
            ) : (
              items.map((n) => (
                <Link
                  key={n.id}
                  href={linkFor(n)}
                  onClick={() => {
                    if (!n.readAt) onMarkRead(n.id);
                    setOpen(false);
                  }}
                  className={`flex items-start gap-3 border-b border-cream-100 px-4 py-3 last:border-0 hover:bg-cream-100/60 dark:border-forest-700/60 dark:hover:bg-forest-700/40 ${
                    n.readAt ? 'opacity-60' : ''
                  }`}
                >
                  <span className="text-lg leading-none">{iconFor(n.type)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-forest-900 dark:text-cream-100">{titleFor(n)}</span>
                    <span className="block text-xs text-forest-700/50 dark:text-cream-100/50">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </span>
                  {!n.readAt && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold-500" />}
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
