'use client';

import { useEffect, useState } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { hasAnalyticsConsent } from '@/components/cookies/cookies';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    if (!key || !host) return;
    if (!hasAnalyticsConsent()) return;
    if (navigator.doNotTrack === '1') return;

    posthog.init(key, {
      api_host: host,
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: true,
      disable_session_recording: true,
      loaded: () => setEnabled(true),
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (hasAnalyticsConsent() && !posthog.__loaded) {
        window.location.reload();
      }
      if (!hasAnalyticsConsent() && posthog.__loaded) {
        posthog.opt_out_capturing();
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!enabled) return <>{children}</>;
  return <PHProvider client={posthog}>{children}</PHProvider>;
}
