'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { getConversations, type ConversationSummary } from '@/lib/conversation-client';
import { getChatSocket } from '@/lib/socket';
import { formatDistanceToNow } from '@/lib/utils';

function Avatar({ name, photo, fallback }: { name?: string | null; photo?: string | null; fallback: string }) {
  if (photo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={photo} alt={name ?? 'Vendor'} className="h-10 w-10 rounded-full object-cover" />;
  }
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-700/10 text-sm font-semibold text-forest-800 dark:bg-forest-700 dark:text-cream-100">
      {fallback}
    </div>
  );
}

export function ConversationsList() {
  const [items, setItems] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    getConversations()
      .then((res) => setItems(res.conversations))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    const socket = getChatSocket();
    const onMessage = () => load();
    socket.on('message', onMessage);
    // Safety net in case the socket drops.
    const t = setInterval(load, 20000);
    return () => {
      clearInterval(t);
      socket.off('message', onMessage);
    };
  }, [load]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-4 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">Messages</h1>
      {loading ? (
        <p className="text-sm text-forest-700/60 dark:text-cream-100/60">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-forest-700/60 dark:text-cream-100/60">No conversations yet. Message a vendor from their profile or a listing.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((c) => {
            const name = c.vendor.businessName;
            const otherInitial = name.charAt(0).toUpperCase();
            return (
              <li key={c.id}>
                <Link
                  href={`/messages/${c.id}`}
                  className="flex items-center gap-3 rounded-2xl border border-cream-200 bg-cream-50 p-3 transition hover:shadow-sm dark:border-forest-700 dark:bg-forest-800 dark:border-cream-100"
                >
                  <Avatar name={name} photo={c.vendor.profilePhotoPublicId} fallback={otherInitial} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-forest-900 dark:text-cream-100">{name}</p>
                      <span className="shrink-0 text-xs text-forest-700/50 dark:text-cream-100/50">
                        {formatDistanceToNow(new Date(c.lastMessageAt))}
                      </span>
                    </div>
                    <p className="truncate text-sm text-forest-700/70 dark:text-cream-100/70">
                      {c.lastMessage?.body ?? 'No messages yet'}
                    </p>
                    {c.listing && (
                      <p className="truncate text-xs text-forest-700/50 dark:text-cream-100/50">Re: {c.listing.title}</p>
                    )}
                  </div>
                  {c.unreadCount > 0 && (
                    <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1.5 text-xs font-bold text-forest-900">
                      {c.unreadCount}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
