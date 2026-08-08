import { type Metadata } from 'next';
import { getMyAnalytics } from '@/lib/vendor-client';

export const metadata: Metadata = {
  title: 'Analytics',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const data = await getMyAnalytics();
  const stats = data?.stats ?? {
    totalViews: 0,
    viewsLast7Days: 0,
    viewsLast30Days: 0,
    totalClicks: 0,
    clicksLast7Days: 0,
    conversionRate: 0,
    activeListings: 0,
    totalReviews: 0,
    avgRating: 0,
    trustScore: 0,
  };

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">Analytics</h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-cream-300 bg-cream-50 p-4 dark:border-forest-700 dark:bg-forest-800">
          <p className="text-xs uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">Total views</p>
          <p className="mt-1 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">{stats.totalViews}</p>
          <p className="text-xs text-forest-700/60 dark:text-cream-100/60">+{stats.viewsLast7Days} this week</p>
        </div>
        <div className="rounded-2xl border border-cream-300 bg-cream-50 p-4 dark:border-forest-700 dark:bg-forest-800">
          <p className="text-xs uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">WhatsApp clicks</p>
          <p className="mt-1 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">{stats.totalClicks}</p>
          <p className="text-xs text-forest-700/60 dark:text-cream-100/60">+{stats.clicksLast7Days} this week</p>
        </div>
        <div className="rounded-2xl border border-cream-300 bg-cream-50 p-4 dark:border-forest-700 dark:bg-forest-800">
          <p className="text-xs uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">Conversion</p>
          <p className="mt-1 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">{stats.conversionRate}%</p>
          <p className="text-xs text-forest-700/60 dark:text-cream-100/60">Views → clicks</p>
        </div>
        <div className="rounded-2xl border border-cream-300 bg-cream-50 p-4 dark:border-forest-700 dark:bg-forest-800">
          <p className="text-xs uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">Rating</p>
          <p className="mt-1 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">{stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '—'}</p>
          <p className="text-xs text-forest-700/60 dark:text-cream-100/60">{stats.totalReviews} reviews</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-cream-300 bg-cream-50 p-4 dark:border-forest-700 dark:bg-forest-800">
          <p className="text-xs uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">Views last 30 days</p>
          <p className="mt-1 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">{stats.viewsLast30Days}</p>
        </div>
        <div className="rounded-2xl border border-cream-300 bg-cream-50 p-4 dark:border-forest-700 dark:bg-forest-800">
          <p className="text-xs uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">Active listings</p>
          <p className="mt-1 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">{stats.activeListings}</p>
        </div>
        <div className="rounded-2xl border border-cream-300 bg-cream-50 p-4 dark:border-forest-700 dark:bg-forest-800">
          <p className="text-xs uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">Trust score</p>
          <p className="mt-1 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">{stats.trustScore}/100</p>
        </div>
        <div className="rounded-2xl border border-cream-300 bg-cream-50 p-4 dark:border-forest-700 dark:bg-forest-800">
          <p className="text-xs uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">Reviews</p>
          <p className="mt-1 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">{stats.totalReviews}</p>
        </div>
      </div>

      {data?.topListings?.length > 0 && (
        <div className="rounded-2xl border border-cream-300 bg-cream-50 p-5 dark:border-forest-700 dark:bg-forest-800">
          <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Top listings</h2>
          <p className="text-sm text-forest-700/60 dark:text-cream-100/60">Detailed analytics (charts, trends, search terms) coming in a future update.</p>
        </div>
      )}
    </div>
  );
}
