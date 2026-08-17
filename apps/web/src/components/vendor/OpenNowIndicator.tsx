'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export function OpenNowIndicator({ slug }: { slug: string }) {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    api<{ isOpen: boolean }>(`/api/vendors/${slug}/is-open`)
      .then((r) => setOpen(r.isOpen))
      .catch(() => setOpen(null));
  }, [slug]);

  if (open === null) return <span className="text-forest-700/50 dark:text-cream-100/50">—</span>;
  return open ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
      <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Open now
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-100 px-2.5 py-1 text-xs font-medium text-forest-700 dark:bg-forest-900/60 dark:text-cream-100">
      <span className="h-1.5 w-1.5 rounded-full bg-forest-400" /> Closed
    </span>
  );
}
