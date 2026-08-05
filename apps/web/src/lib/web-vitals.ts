import { onLCP, onFID, onCLS, onINP, onTTFB, onFCP } from 'web-vitals';
import { trackEvent } from '@/components/analytics/events';

const sendToAnalytics = (metric: { name: string; value: number; id: string; rating: string }): void => {
  trackEvent('web_vital', {
    name: metric.name,
    value: metric.value,
    id: metric.id,
    rating: metric.rating,
  });
};

export function reportWebVitals(): void {
  if (typeof window === 'undefined') return;
  onLCP(sendToAnalytics);
  onFID(sendToAnalytics);
  onCLS(sendToAnalytics);
  onINP(sendToAnalytics);
  onTTFB(sendToAnalytics);
  onFCP(sendToAnalytics);
}
