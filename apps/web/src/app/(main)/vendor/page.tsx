import { type Metadata } from 'next';
import Link from 'next/link';
import { getMyVendor, getMyAnalytics, getMyListings } from '@/lib/vendor-client';
import { Button } from '@/components/ui/Button';
import { ArrowRightIcon } from '@/components/icons';
import type { Listing } from '@/lib/vendor-client';

export const metadata: Metadata = {
  title: 'Vendor dashboard',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function VendorDashboardPage() {
  const [vendorResult, analytics, listings] = await Promise.all([
    getMyVendor(),
    getMyAnalytics().catch(() => null),
    getMyListings().catch(() => null),
  ]);

  if (!('vendor' in vendorResult)) return null;
  const vendor = vendorResult.vendor;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">
            {vendor.businessName}
          </h1>
          <p className="mt-1 text-sm text-forest-700/70 dark:text-cream-100/70">
            {vendor.status === 'live' ? (
              <span className="text-green-600">● Live</span>
            ) : (
              <span className="text-amber-600">● {vendor.status}</span>
            )}
          </p>
        </div>
        <Button variant="outline" rightIcon={<ArrowRightIcon className="h-4 w-4" />}>
          <Link href={`/v/${vendor.businessSlug}`} target="_blank">View public page</Link>
        </Button>
      </div>

      {vendor.status !== 'live' && (
        <div className="rounded-2xl border-2 border-gold-500/30 bg-gold-500/5 p-6">
          <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">
            Complete your setup
          </h2>
          <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">
            Your profile is at {vendorResult.progress}%. Finish the remaining steps to go live.
          </p>
          <div className="mt-4">
            <Button>
              <Link href="/vendor/onboarding/step-1">Continue setup</Link>
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-cream-300 bg-cream-50 p-4 dark:border-forest-700 dark:bg-forest-800">
          <p className="text-xs uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">Views</p>
          <p className="mt-1 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">
            {analytics?.stats.totalViews ?? 0}
          </p>
        </div>
        <div className="rounded-2xl border border-cream-300 bg-cream-50 p-4 dark:border-forest-700 dark:bg-forest-800">
          <p className="text-xs uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">WhatsApp clicks</p>
          <p className="mt-1 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">
            {analytics?.stats.whatsappClicks ?? 0}
          </p>
        </div>
        <div className="rounded-2xl border border-cream-300 bg-cream-50 p-4 dark:border-forest-700 dark:bg-forest-800">
          <p className="text-xs uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">Listings</p>
          <p className="mt-1 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">
            {analytics?.stats.activeListings ?? 0}
          </p>
        </div>
        <div className="rounded-2xl border border-cream-300 bg-cream-50 p-4 dark:border-forest-700 dark:bg-forest-800">
          <p className="text-xs uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">Reviews</p>
          <p className="mt-1 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">
            {analytics?.stats.reviews ?? 0}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-cream-300 bg-cream-50 p-6 dark:border-forest-700 dark:bg-forest-800">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">
            Your listings
          </h2>
          <Button variant="primary" size="sm">
            <Link href="/vendor/listings/new">Add listing</Link>
          </Button>
        </div>
        {listings && listings.listings.length > 0 ? (
          <div className="mt-4 space-y-2">
            {listings.listings.slice(0, 5).map((l: Listing) => (
              <div key={l.id} className="flex items-center justify-between rounded-lg border border-cream-200 p-3 dark:border-forest-700">
                <div>
                  <p className="font-medium text-forest-900 dark:text-cream-100">{l.title}</p>
                  <p className="text-xs text-forest-700/60 dark:text-cream-100/60">
                    {l.category.name} · {l.status}
                  </p>
                </div>
                <Link href={`/vendor/listings/${l.id}/edit`} className="text-sm font-medium text-forest-700 hover:underline dark:text-gold-500">
                  Edit
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-forest-700/60 dark:text-cream-100/60">
            No listings yet. Create your first one to start appearing in search.
          </p>
        )}
      </div>
    </div>
  );
}
