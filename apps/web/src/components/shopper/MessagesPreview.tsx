'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getConversations, type ConversationSummary } from '@/lib/conversation-client';

export function MessagesPreview() {
  const [items, setItems] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getConversations()
      .then((r) => setItems(r.conversations.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-sm text-forest-700/60 dark:text-cream-100/60">Loading…</p>;
  }
  if (items.length === 0) {
    return (
      <p className="text-sm text-forest-700/70 dark:text-cream-100/70">
        No conversations yet. Message a vendor from their profile to start one.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((c) => (
        <li key={c.id}>
          <Link
            href={`/messages/${c.id}`}
            className="flex items-center gap-3 rounded-xl border border-cream-200 p-3 transition hover:shadow-sm dark:border-forest-700 dark:border-cream-100"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-700/10 text-sm font-semibold text-forest-800 dark:bg-forest-700 dark:text-cream-100">
              {c.vendor.businessName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-forest-900 dark:text-cream-100">{c.vendor.businessName}</p>
              <p className="truncate text-xs text-forest-700/70 dark:text-cream-100/70">{c.lastMessage?.body ?? 'No messages yet'}</p>
            </div>
            {c.unreadCount > 0 && (
              <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1.5 text-xs font-bold text-forest-900">
                {c.unreadCount}
              </span>
            )}
          </Link>
        </li>
      ))}
      <li>
        <Link href="/messages" className="inline-block text-sm font-medium text-forest-700 hover:underline dark:text-gold-400">
          View all messages →
        </Link>
      </li>
    </ul>
  );
}
