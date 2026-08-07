import { type Metadata } from 'next';
import { getMyAnalytics } from '@/lib/vendor-client';

export const metadata: Metadata = {
  title: 'Analytics',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const data = await getMyAnalytics();
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">Analytics</h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-cream-300 bg-cream-50 p-4 dark:border-forest-700 dark:bg-forest-800">
          <p className="text-xs uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">Total views</p>
          <p className="mt-1 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">{data.stats.totalViews}</p>
        </div>
        <div className="rounded-2xl border border-cream-300 bg-cream-50 p-4 dark:border-forest-700 dark:bg-forest-800">
          <p className="text-xs uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">WhatsApp clicks</p>
          <p className="mt-1 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">{data.stats.whatsappClicks}</p>
        </div>
        <div className="rounded-2xl border border-cream-300 bg-cream-50 p-4 dark:border-forest-700 dark:bg-forest-800">
          <p className="text-xs uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">Active listings</p>
          <p className="mt-1 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">{data.stats.activeListings}</p>
        </div>
        <div className="rounded-2xl border border-cream-300 bg-cream-50 p-4 dark:border-forest-700 dark:bg-forest-800">
          <p className="text-xs uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">Reviews</p>
          <p className="mt-1 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">{data.stats.reviews}</p>
        </div>
      </div>
      <p className="text-sm text-forest-700/60 dark:text-cream-100/60">
        Detailed analytics (charts, trends, search terms) coming in a future update.
      </p>
    </div>
  );
}
