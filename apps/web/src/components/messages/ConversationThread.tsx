'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { getMessages, sendMessage, markConversationRead, type MessageItem } from '@/lib/conversation-client';
import { getMe } from '@/lib/auth-client';
import { getChatSocket } from '@/lib/socket';

export function ConversationThread({ conversationId }: { conversationId: string }) {
  const [myId, setMyId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = useCallback(() => {
    getMessages(conversationId)
      .then((res) => setMessages(res.messages))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [conversationId]);

  useEffect(() => {
    getMe().then((res) => setMyId(res.user.id)).catch(() => {});
    load();
    markConversationRead(conversationId).catch(() => {});

    const socket = getChatSocket();
    socket.emit('join', conversationId);
    const onMessage = (msg: MessageItem) => {
      if (msg.conversationId === conversationId) setMessages((prev) => [...prev, msg]);
    };
    socket.on('message', onMessage);

    // Safety net: catches anything missed if the socket drops.
    const t = setInterval(load, 20000);

    return () => {
      clearInterval(t);
      socket.emit('leave', conversationId);
      socket.off('message', onMessage);
    };
  }, [load, conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onSend = async () => {
    const body = draft.trim();
    if (!body || sending) return;
    setSending(true);
    setDraft('');

    // Prefer realtime; fall back to REST if the socket isn't connected.
    const socket = getChatSocket();
    if (socket.connected) {
      socket.emit('message', { conversationId, body }, (res: { ok: boolean; message?: MessageItem }) => {
        if (res?.ok && res.message) setMessages((prev) => [...prev, res.message!]);
        else sendMessage(conversationId, body).then((msg) => setMessages((prev) => [...prev, msg])).catch(() => {});
        setSending(false);
      });
    } else {
      try {
        const msg = await sendMessage(conversationId, body);
        setMessages((prev) => [...prev, msg]);
      } finally {
        setSending(false);
      }
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-2xl flex-col px-4">
      <div className="border-b border-cream-200 py-3 dark:border-forest-700 dark:border-cream-100">
        <Link href="/messages" className="text-sm text-forest-700/70 hover:underline dark:text-cream-100/70">
          ← Back
        </Link>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto py-4">
        {loading ? (
          <p className="text-sm text-forest-700/60 dark:text-cream-100/60">Loading…</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-forest-700/60 dark:text-cream-100/60">No messages yet. Say hello!</p>
        ) : (
          messages.map((m) => {
            const mine = m.senderId === myId;
            return (
              <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                    mine
                      ? 'bg-forest-700 text-cream-100'
                      : 'bg-cream-200 text-forest-900 dark:bg-forest-700 dark:text-cream-100'
                  }`}
                >
                  {m.body}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-2 border-t border-cream-200 py-3 dark:border-forest-700 dark:border-cream-100">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          rows={1}
          placeholder="Type a message…"
          className="flex-1 resize-none rounded-xl border border-cream-200 bg-cream-50 px-3 py-2 text-sm text-forest-900 outline-none focus:border-forest-700 dark:border-forest-700 dark:bg-forest-800 dark:border-cream-100 dark:text-cream-100"
        />
        <button
          type="button"
          onClick={onSend}
          disabled={sending || !draft.trim()}
          className="rounded-xl bg-gold-500 px-4 py-2 text-sm font-semibold text-forest-900 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
