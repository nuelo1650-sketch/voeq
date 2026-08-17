'use client';

import { useEffect, useRef } from 'react';
import { trackView } from '@/lib/analytics-client';

interface ViewTrackerProps {
  kind: 'listing' | 'vendor';
  id: string;
  campusId: string | null | undefined;
}

/**
 * Fires a single view event on mount. Optional auth: the API counts logged-out
 * traffic too, but we only send campusId (always available from the server).
 */
export function ViewTracker({ kind, id, campusId }: ViewTrackerProps) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current || !campusId) return;
    fired.current = true;
    trackView(kind, id, campusId).catch(() => {});
  }, [kind, id, campusId]);

  return null;
}
