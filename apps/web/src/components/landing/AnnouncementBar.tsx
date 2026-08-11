'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'voeq_announcement_dismissed';

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === '1') {
        setVisible(false);
      }
    } catch {
      // localStorage unavailable (SSR / privacy mode)
    }
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // localStorage unavailable
    }
  };

  if (!visible) return null;

  return (
    <div className="bg-forest-700 text-cream-100 py-3 px-4 text-center text-sm relative">
      <span>🎉 Voeq is live at NMU — find vendors now</span>
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
