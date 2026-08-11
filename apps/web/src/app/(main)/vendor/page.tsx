import { type Metadata } from 'next';
import Link from 'next/link';
import { serverGetMyVendor as getMyVendor, serverGetMyAnalytics as getMyAnalytics, serverGetMyListings as getMyListings } from '@/lib/vendor-server';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { ArrowRightIcon, ChevronRightIcon, CheckIcon, StarIcon, ShareIcon } from '@/components/icons';
import type { Listing } from '@/lib/vendor-client';
import { VendorPageHeader, VendorSection } from '@/components/vendor/VendorPageShell';
import { AnimatedSection } from '@/components/landing/AnimatedSection';

export const metadata: Metadata = {
  title: 'Vendor dashboard',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

function TrendBadge({ trend, label }: { trend: 'up' | 'down' | 'flat'; label: string }) {
  if (trend === 'up') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
        ↑ {label}
      </span>
    );
  }
  if (trend === 'down') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-300">
        ↓ {label}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-cream-100 px-2 py-0.5 text-xs font-medium text-forest-700 dark:bg-forest-800 dark:text-cream-100">
      — {label}
    </span>
  );
}

function StatCard({ title, value, sub, trend, trendLabel, icon }: { title: string; value: string | number; sub?: string; trend?: 'up' | 'down' | 'flat'; trendLabel?: string; icon?: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-cream-300 bg-cream-50 p-5 transition hover:shadow-sm dark:border-forest-700 dark:bg-forest-800">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">{title}</p>
          <p className="mt-2 font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">{value}</p>
          {sub ? <p className="mt-1 text-xs text-forest-700/70 dark:text-cream-100/70">{sub}</p> : null}
        </div>
        <div className="rounded-xl bg-cream-100 p-2 dark:bg-forest-900/60">{icon}</div>
      </div>
      {trendLabel ? (
        <div className="mt-3">
          <TrendBadge trend={trend ?? 'flat'} label={trendLabel} />
        </div>
      ) : null}
    </div>
  );
}

function QuickAction({ title, description, href, cta }: { title: string; description: string; href: string; cta: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-2xl border border-cream-300 bg-cream-50 p-4 transition hover:border-forest-300 hover:shadow-sm dark:border-forest-700 dark:bg-forest-800 dark:hover:border-forest-600"
    >
      <div className="min-w-0">
        <p className="font-medium text-forest-900 dark:text-cream-100">{title}</p>
        <p className="mt-1 truncate text-sm text-forest-700/70 dark:text-cream-100/70">{description}</p>
      </div>
      <div className="ml-4 flex shrink-0 items-center gap-1 text-sm font-medium text-forest-700 group-hover:text-forest-900 dark:text-cream-100 dark:group-hover:text-cream-50">
        {cta}
        <ChevronRightIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

export default async function VendorDashboardPage() {
  const [vendorResult, analytics, listings] = await Promise.all([
    getMyVendor(),
    getMyAnalytics().catch(() => null),
    getMyListings().catch(() => null),
  ]);

  if (!('vendor' in vendorResult)) return null;
  const vendor = vendorResult.vendor;

  const stats = analytics?.stats ?? null;
  const listingItems = listings?.listings ?? [];
  const progress = vendorResult.progress ?? 0;
  const isLive = vendor.status === 'live';

  return (
    <>
      <VendorPageHeader
        title={vendor.businessName}
        subtitle={
          <div className="flex items-center gap-2 text-sm text-forest-700/70 dark:text-cream-100/70">
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Live
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-gold-500/15 dark:text-gold-500">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> {vendor.status}
              </span>
            )}
            <span>·</span>
            <span>{vendor.ownerName}</span>
          </div>
        }
      >
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" rightIcon={<ShareIcon className="h-4 w-4" />}>
            <Link href={`/v/${vendor.businessSlug}`} target="_blank">View storefront</Link>
          </Button>
          <Button variant="primary" rightIcon={<ArrowRightIcon className="h-4 w-4" />}>
            <Link href={`/vendor/listings/new`}>New listing</Link>
          </Button>
        </div>
      </VendorPageHeader>

      <VendorSection>
        <Container size="xl">
          <AnimatedSection>
            <div className="space-y-6">
              {!isLive && (
                <div className="relative overflow-hidden rounded-2xl border-2 border-gold-500/30 bg-gold-500/5 p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Complete your setup</h2>
                      <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">
                        Your profile is {progress}% complete. Finish the remaining steps to go live and start receiving customers.
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="h-2 w-40 overflow-hidden rounded-full bg-gold-500/20">
                          <div className="h-full rounded-full bg-gold-500" style={{ width: `${progress}%` }} />
                        </div>
                        <span className="text-xs font-medium text-forest-700 dark:text-cream-100">{progress}%</span>
                      </div>
                    </div>
                    <Button variant="gold" rightIcon={<ArrowRightIcon className="h-4 w-4" />}>
                      <Link href="/vendor/onboarding/step-1">Continue setup</Link>
                    </Button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  title="Views"
                  value={stats?.totalViews ?? 0}
                  sub={!stats ? 'Analytics unavailable' : 'Total public profile views'}
                  trend={stats ? 'up' : 'flat'}
                  trendLabel={stats ? 'Live data' : 'Pending'}
                  icon={<StarIcon className="h-5 w-5 text-forest-700 dark:text-cream-100" />}
                />
                <StatCard
                  title="WhatsApp clicks"
                  value={stats?.totalClicks ?? 0}
                  sub={stats ? `${stats.clicksLast7Days} this week` : "Inquiries from your storefront"}
                  trend="flat"
                  trendLabel="This period"
                  icon={<svg className="h-5 w-5 text-forest-700 dark:text-cream-100" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488" /></svg>}
                />
                <StatCard
                  title="Active listings"
                  value={stats?.activeListings ?? vendor._count.listings}
                  sub={listingItems.length === 0 ? 'No listings yet' : `${listingItems.length} total listed`}
                  trend={listingItems.length === 0 ? 'flat' : 'up'}
                  trendLabel={listingItems.length === 0 ? 'Get started' : 'Active inventory'}
                  icon={<CheckIcon className="h-5 w-5 text-forest-700 dark:text-cream-100" />}
                />
                <StatCard
                  title="Reviews"
                  value={stats?.totalReviews ?? 0}
                  sub={stats ? `${stats.totalReviews} reviews` : "Customer ratings on storefront"}
                  trend={stats ? 'up' : 'flat'}
                  trendLabel={stats ? 'Growing' : 'Pending'}
                  icon={<svg className="h-5 w-5 text-forest-700 dark:text-cream-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="rounded-2xl border border-cream-300 bg-cream-50 p-5 dark:border-forest-700 dark:bg-forest-800 lg:col-span-2">
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Your listings</h2>
                    <Button variant="outline" size="sm" rightIcon={<ArrowRightIcon className="h-4 w-4" />}>
                      <Link href="/vendor/listings">View all</Link>
                    </Button>
                  </div>
                  {listingItems.length > 0 ? (
                    <div className="mt-4 divide-y divide-cream-200 dark:divide-forest-700">
                      {listingItems.slice(0, 5).map((l: Listing) => (
                        <div key={l.id} className="flex items-center justify-between py-3">
                          <div className="min-w-0">
                            <p className="font-medium text-forest-900 dark:text-cream-100 truncate">{l.title}</p>
                            <div className="mt-1 flex items-center gap-2 text-xs text-forest-700/60 dark:text-cream-100/60">
                              <span>{l.category.name}</span>
                              <span>·</span>
                              <span className="capitalize">{l.status}</span>
                            </div>
                          </div>
                          <div className="ml-4 flex items-center gap-3">
                            {l.status === 'active' ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                <span className="h-1 w-1 rounded-full bg-green-500" /> Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-cream-100 px-2 py-0.5 text-xs font-medium text-forest-700 dark:bg-forest-900/60 dark:text-cream-100">
                                <span className="h-1 w-1 rounded-full bg-forest-500" /> {l.status}
                              </span>
                            )}
                            <Link href={`/vendor/listings/${l.id}/edit`} className="inline-flex items-center gap-1 text-sm font-medium text-forest-700 hover:text-forest-900 dark:text-gold-500 dark:hover:text-gold-400">
                              Edit
                              <ChevronRightIcon className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-5 rounded-xl border border-dashed border-cream-300 p-6 text-center dark:border-forest-700">
                      <p className="text-sm text-forest-700/70 dark:text-cream-100/70">No listings yet. Create your first one to start appearing in search.</p>
                      <div className="mt-4">
                        <Button variant="primary" size="sm">
                          <Link href="/vendor/listings/new">Create your first listing</Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Quick actions</h2>
                  <QuickAction title="Update business profile" description="Edit details, hours, and contact info" href="/vendor/profile" cta="Open" />
                  <QuickAction title="Add a new listing" description="Post a new item or service" href="/vendor/listings/new" cta="Create" />
                  <QuickAction title="Share your storefront" description="Copy your public page link" href={`/v/${vendor.businessSlug}`} cta="View" />
                </div>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </VendorSection>
    </>
  );
}
