'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'voeq_announcement_dismissed';

export function AnnouncementBar({ messages }: { messages?: string[] }) {
  const [visible, setVisible] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === '1') {
        setVisible(false);
      }
    } catch {
      // localStorage unavailable (SSR / privacy mode)
    }
  }, []);

  useEffect(() => {
    if (!visible || !messages || messages.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [visible, messages]);

  const handleDismiss = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // localStorage unavailable
    }
  };

  if (!visible) return null;

  const text = messages && messages.length > 0
    ? messages[index % messages.length]
    : '🎉 Voeq is live at NMU — find vendors now';

  return (
    <div className="bg-forest-700 text-cream-100 py-3 px-4 text-center text-sm relative overflow-hidden">
      <span key={index} className="inline-block animate-[fade-in_0.5s_ease-out]">
        {text}
      </span>
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-cream-100/70 hover:text-cream-100"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
