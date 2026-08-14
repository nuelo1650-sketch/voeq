import { type Metadata } from 'next';
import { getMyAnalytics } from '@/lib/vendor-client';
import { requireVendor } from '@/lib/auth-server';
import { Container } from '@/components/ui/Container';
import { VendorPageHeader, VendorSection } from '@/components/vendor/VendorPageShell';
import { ThreadCard } from '@/components/brand/Thread';
import { AnimatedSection } from '@/components/landing/AnimatedSection';

export const metadata: Metadata = {
  title: 'Analytics',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  requireVendor();
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
    <>
      <VendorPageHeader title="Analytics" subtitle="Track views, clicks, and performance across your storefront." />
      <VendorSection>
        <Container size="xl">
          <AnimatedSection>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <ThreadCard className="p-4">
                <p className="text-xs uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">Total views</p>
                <p className="mt-1 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">{stats.totalViews}</p>
                <p className="text-xs text-forest-700/60 dark:text-cream-100/60">+{stats.viewsLast7Days} this week</p>
              </ThreadCard>
              <ThreadCard className="p-4">
                <p className="text-xs uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">WhatsApp clicks</p>
                <p className="mt-1 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">{stats.totalClicks}</p>
                <p className="text-xs text-forest-700/60 dark:text-cream-100/60">+{stats.clicksLast7Days} this week</p>
              </ThreadCard>
              <ThreadCard className="p-4">
                <p className="text-xs uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">Conversion</p>
                <p className="mt-1 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">{stats.conversionRate}%</p>
                <p className="text-xs text-forest-700/60 dark:text-cream-100/60">Views → clicks</p>
              </ThreadCard>
              <ThreadCard className="p-4">
                <p className="text-xs uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">Rating</p>
                <p className="mt-1 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">{stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '—'}</p>
                <p className="text-xs text-forest-700/60 dark:text-cream-100/60">{stats.totalReviews} reviews</p>
              </ThreadCard>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <ThreadCard className="p-4">
                <p className="text-xs uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">Views last 30 days</p>
                <p className="mt-1 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">{stats.viewsLast30Days}</p>
              </ThreadCard>
              <ThreadCard className="p-4">
                <p className="text-xs uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">Active listings</p>
                <p className="mt-1 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">{stats.activeListings}</p>
              </ThreadCard>
              <ThreadCard className="p-4">
                <p className="text-xs uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">Trust score</p>
                <p className="mt-1 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">{stats.trustScore}/100</p>
              </ThreadCard>
              <ThreadCard className="p-4">
                <p className="text-xs uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">Reviews</p>
                <p className="mt-1 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">{stats.totalReviews}</p>
              </ThreadCard>
            </div>

            {data?.topListings?.length > 0 && (
              <ThreadCard className="mt-6 p-5">
                <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Top listings</h2>
                <p className="mt-2 text-sm text-forest-700/60 dark:text-cream-100/60">Detailed analytics (charts, trends, search terms) coming in a future update.</p>
              </ThreadCard>
            )}
          </AnimatedSection>
        </Container>
      </VendorSection>
    </>
  );
}
