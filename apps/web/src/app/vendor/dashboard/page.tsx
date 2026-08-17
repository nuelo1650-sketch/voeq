import { type Metadata } from 'next';
import Link from 'next/link';
import { serverGetMyVendor as getMyVendor, serverGetMyAnalytics as getMyAnalytics, serverGetMyListings as getMyListings } from '@/lib/vendor-server';
import { serverGetMe as getMe } from '@/lib/auth-server';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { ArrowRightIcon, ChevronRightIcon, ShareIcon } from '@/components/icons';
import type { Listing } from '@/lib/vendor-client';
import { VendorPageHeader, VendorSection } from '@/components/vendor/VendorPageShell';
import { ThreadCard } from '@/components/brand/Thread';
import { AnimatedSection } from '@/components/landing/AnimatedSection';
import { requireVendor } from '@/lib/auth-server';
import { VendorWelcomeOverlay } from '@/components/vendor/VendorWelcomeOverlay';
import { NotificationBell } from '@/components/user/NotificationBell';
import { OpenNowIndicator } from '@/components/vendor/OpenNowIndicator';
import { VendorTrendCard } from '@/components/vendor/VendorTrendCard';
import { PerListingTable } from '@/components/vendor/PerListingTable';
import { ReviewsPanel } from '@/components/vendor/ReviewsPanel';

export const metadata: Metadata = {
  title: 'Vendor dashboard',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

function QuickAction({ title, description, href, cta }: { title: string; description: string; href: string; cta: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-2xl border border-cream-300 bg-cream-50 p-4 transition hover:border-forest-300 hover:shadow-sm dark:border-forest-700 dark:bg-forest-800 dark:hover:border-forest-600 dark:border-cream-100"
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

function GrowPrompt({ title, href }: { title: string; href: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-xl border border-forest-700/15 bg-cream-50 px-4 py-3 text-sm font-medium text-forest-800 transition hover:border-forest-500 hover:bg-forest-700/5 dark:border-forest-600 dark:bg-forest-800 dark:text-cream-100"
    >
      {title}
      <ChevronRightIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
    </Link>
  );
}

export default async function VendorDashboardPage() {
  await requireVendor();
  const [vendorResult, analytics, listings, me] = await Promise.all([
    getMyVendor().catch(() => null),
    getMyAnalytics().catch(() => null),
    getMyListings().catch(() => null),
    getMe().catch(() => null),
  ]);

  // Graceful degradation: if /me 404s (row not yet created) but the user is a
  // vendor-role, send them to onboarding to create the Vendor row. Never crash
  // the whole dashboard on a transient 404.
  if (!vendorResult || !('vendor' in vendorResult)) {
    return (
      <VendorSection>
        <Container size="md">
          <div className="rounded-2xl border-2 border-gold-500/30 bg-gold-500/5 p-8 text-center">
            <h2 className="font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">
              Finish setting up your storefront
            </h2>
            <p className="mt-2 text-sm text-forest-700/80 dark:text-cream-100/80">
              Your vendor profile isn&apos;t complete yet. A few quick steps and you&apos;ll be live.
            </p>
            <div className="mt-6">
              <Button variant="primary" asChild>
                <Link href="/vendor/onboarding/step-1">Continue setup</Link>
              </Button>
            </div>
          </div>
        </Container>
      </VendorSection>
    );
  }
  const vendor = vendorResult.vendor;

  const stats = analytics?.stats ?? null;
  const listingItems = listings?.listings ?? [];
  const progress = vendorResult.progress ?? 0;
  const isLive = vendor.status === 'live';
  const showWelcome = !me?.user?.homeSeenAt;

  return (
    <>
      <VendorPageHeader
        title={vendor.businessName}
        subtitle={
          <div className="flex flex-wrap items-center gap-2 text-sm text-forest-700/70 dark:text-cream-100/70">
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Live
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-gold-500/15 dark:text-gold-500">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> {vendor.status}
              </span>
            )}
            {vendor.verifiedBadge && (
              <span className="inline-flex items-center gap-1 rounded-full bg-forest-700/10 px-2.5 py-1 text-xs font-medium text-forest-800 dark:bg-forest-700 dark:text-cream-100">
                ✓ Verified
              </span>
            )}
            {stats && (
              <span className="inline-flex items-center gap-1 rounded-full bg-cream-100 px-2.5 py-1 text-xs font-medium text-forest-700 dark:bg-forest-900/60 dark:text-cream-100">
                Trust {stats.trustScore}
              </span>
            )}
            <OpenNowIndicator slug={vendor.businessSlug} />
            <span>·</span>
            <span>{vendor.ownerName}</span>
          </div>
        }
      >
        <div className="flex items-center gap-2">
          <NotificationBell />
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

              {stats && analytics?.daily ? (
                <VendorTrendCard daily={analytics.daily} stats={{
                  totalViews: stats.totalViews,
                  totalClicks: stats.totalClicks,
                  conversationsStarted: stats.conversationsStarted,
                  totalReviews: stats.totalReviews,
                }} />
              ) : (
                <ThreadCard className="p-5 text-sm text-forest-700/70 dark:text-cream-100/70">Analytics unavailable.</ThreadCard>
              )}

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {analytics?.topListings ? (
                  <PerListingTable listings={analytics.topListings as unknown as Array<{
                    id: string; title: string; slug: string; viewCount: number; whatsappClickCount: number; photos: Array<{ url: string }>;
                  }>} />
                ) : (
                  <ThreadCard className="p-5 text-sm text-forest-700/70 dark:text-cream-100/70">Listing performance unavailable.</ThreadCard>
                )}
                <ReviewsPanel vendorId={vendor.id} businessSlug={vendor.businessSlug} />
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <ThreadCard className="p-5 lg:col-span-2">
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
                            <Link href={`/vendor/listings/${l.id}/edit`} className="inline-flex items-center gap-1 text-sm font-medium text-forest-700 hover:text-forest-900 dark:text-gold-500 dark:hover:text-gold-400 dark:text-cream-100">
                              Edit
                              <ChevronRightIcon className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-5 rounded-xl border border-dashed border-cream-300 p-6 text-center dark:border-forest-700 dark:border-cream-100">
                      <p className="text-sm text-forest-700/70 dark:text-cream-100/70">No listings yet. Create your first one to start appearing in search.</p>
                      <div className="mt-4">
                        <Button variant="primary" size="sm">
                          <Link href="/vendor/listings/new">Create your first listing</Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </ThreadCard>

                <div className="space-y-3">
                  <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Quick actions</h2>
                  <QuickAction title="Update business profile" description="Edit details, hours, and contact info" href="/vendor/profile" cta="Open" />
                  <QuickAction title="Add a new listing" description="Post a new item or service" href="/vendor/listings/new" cta="Create" />
                  <QuickAction title="Share your storefront" description="Copy your public page link" href={`/v/${vendor.businessSlug}`} cta="View" />
                </div>
              </div>

              {isLive && (
                <ThreadCard className="border-forest-700/20 p-5 dark:border-forest-600">
                  <h2 className="font-serif text-lg font-semibold text-forest-900 dark:text-cream-100">Grow your storefront</h2>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <GrowPrompt title="Add a second listing" href="/vendor/listings/new" />
                    <GrowPrompt title="Complete your operating hours" href="/vendor/profile" />
                    <GrowPrompt title="Share your storefront" href={`/v/${vendor.businessSlug}`} />
                  </div>
                </ThreadCard>
              )}
            </div>
          </AnimatedSection>
        </Container>
      </VendorSection>
      {showWelcome && <VendorWelcomeOverlay storefrontHref={`/v/${vendor.businessSlug}`} />}
    </>
  );
}
