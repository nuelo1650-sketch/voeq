'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { getNotifications } from '@/lib/marketplace-client';
import { getMe } from '@/lib/auth-client';

export function NotificationBell({ className }: { className?: string }) {
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; body: string; vendorSlug: string }>>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      const me = await getMe().catch(() => null);
      if (!me) return;

      const data = await getNotifications().catch(() => ({ notifications: [] }));
      setNotifications(data.notifications.slice(0, 5));
      setUnread(data.notifications.length);
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className ?? ''}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative rounded-full p-2 text-forest-700 hover:bg-cream-200 dark:text-cream-100 dark:hover:bg-forest-800"
        aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ''}`}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unread > 0 && (
          <span className="absolute right-0 top-0 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-cream-300 bg-cream-50 shadow-lg dark:border-forest-700 dark:bg-forest-800">
          <div className="border-b border-cream-200 p-3 dark:border-forest-700">
            <h3 className="text-sm font-semibold text-forest-900 dark:text-cream-100">Notifications</h3>
          </div>
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-forest-700/60 dark:text-cream-100/60">
              No notifications yet
            </div>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {notifications.map((n) => (
                <li key={n.id} className="border-b border-cream-200 last:border-0 dark:border-forest-700">
                  <div className="flex items-start justify-between gap-3 p-3">
                    <Link
                      href={`/v/${n.vendorSlug}`}
                      onClick={() => setOpen(false)}
                      className="flex-1"
                    >
                      <p className="text-sm font-medium text-forest-900 dark:text-cream-100">{n.title}</p>
                      <p className="mt-1 text-xs text-forest-700/60 dark:text-cream-100/60">{n.body}</p>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setNotifications((prev) => prev.filter((item) => item.id !== n.id));
                        setUnread((count) => Math.max(0, count - 1));
                      }}
                      className="flex-shrink-0 rounded p-1 text-forest-700/60 hover:text-forest-900 dark:text-cream-100/60 dark:hover:text-white"
                      aria-label="Dismiss notification"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
