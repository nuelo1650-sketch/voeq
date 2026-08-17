import { type Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireShopper, serverGetMe as getMe } from '@/lib/auth-server';
import { serverGetWishlist as getWishlist, serverGetFollowing as getFollowing } from '@/lib/marketplace-server';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { VendorCard } from '@/components/marketplace/VendorCard';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { ShopperWelcomeOverlay } from '@/components/shopper/ShopperWelcomeOverlay';
import { HeartIcon, CheckIcon, SearchIcon, TrendingUpIcon, SparklesIcon, ArrowRightIcon } from '@/components/icons';
import { ThreadSeam } from '@/components/brand/Thread';
import { formatDistanceToNow } from '@/lib/utils';
import { AnimatedSection } from '@/components/landing/AnimatedSection';
import { NotificationBell } from '@/components/user/NotificationBell';
import { TrendingMiniCard } from '@/components/shopper/TrendingMiniCard';
import { RecentlyViewed } from '@/components/shopper/RecentlyViewed';
import { MyReviews } from '@/components/shopper/MyReviews';
import { MessagesPreview } from '@/components/shopper/MessagesPreview';

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
};

export default async function BuyerDashboardPage() {
  await requireShopper();
  const me = await getMe().catch(() => null);

  const [wishlistData, followingData] = await Promise.all([
    getWishlist().catch(() => ({ items: [] })),
    getFollowing().catch(() => ({ follows: [] })),
  ]);

  const wishlistItems = wishlistData.items.slice(0, 4);
  const followingItems = followingData.follows.slice(0, 4);
  const firstName = me?.user.name?.split(' ')[0] ?? 'there';

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-cream-200 bg-gradient-to-br from-forest-800 via-forest-900 to-forest-950 dark:border-forest-700 dark:border-cream-100">
        <div className="absolute right-4 top-4 z-10">
          <NotificationBell />
        </div>
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,theme(colors.gold.500/0.25),transparent_45%)]" />
        <Container size="lg" className="relative">
          <div className="flex flex-col gap-4 py-10 sm:py-14">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-gold-500/15 px-3 py-1 text-xs font-medium text-gold-600 dark:text-gold-400">
              <SparklesIcon className="h-3.5 w-3.5" /> Your campus marketplace
            </span>
            <h1 className="font-serif text-3xl font-semibold text-cream-100 sm:text-4xl">
              Welcome back, {firstName} 👋
            </h1>
            <p className="max-w-md text-sm text-cream-100/70">
              Here&apos;s what&apos;s happening with your saved vendors and the latest on your campus.
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <Link href="/browse">
                <Button variant="gold" size="lg">
                  <SearchIcon className="h-4 w-4" /> Browse vendors
                </Button>
              </Link>
              <Link href="/vendor/onboarding/step-1">
                <Button variant="outline" size="lg" className="border-cream-100/30 text-cream-100 hover:bg-cream-100/10 dark:border-forest-700/30 dark:bg-forest-900/10">
                  <TrendingUpIcon className="h-4 w-4" /> Sell on Voeq
                </Button>
              </Link>
            </div>
            <ThreadSeam className="mt-2" />
          </div>
        </Container>
      </section>

      <Container size="lg" className="py-8">
        <AnimatedSection>
          <div className="space-y-10">
            {/* Stat tiles */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Link href="/wishlist" className="group">
                <Card className="transition group-hover:-translate-y-0.5 group-hover:border-gold-500/40 group-hover:shadow-lg">
                  <CardContent className="flex items-center justify-between pt-6">
                    <div>
                      <p className="text-sm font-medium text-forest-900 dark:text-cream-100">Saved vendors</p>
                      <p className="mt-1 text-xs text-forest-700/60 dark:text-cream-100/60">View your wishlist</p>
                    </div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/15 text-gold-600 dark:text-gold-400">
                      <HeartIcon className="h-5 w-5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/following" className="group">
                <Card className="transition group-hover:-translate-y-0.5 group-hover:border-gold-500/40 group-hover:shadow-lg">
                  <CardContent className="flex items-center justify-between pt-6">
                    <div>
                      <p className="text-sm font-medium text-forest-900 dark:text-cream-100">Following</p>
                      <p className="mt-1 text-xs text-forest-700/60 dark:text-cream-100/60">Vendors you follow</p>
                    </div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/15 text-gold-600 dark:text-gold-400">
                      <CheckIcon className="h-5 w-5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
              <Card className="flex flex-col">
                <CardContent className="flex flex-1 flex-col pt-6">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-forest-900 dark:text-cream-100">Trending on campus</p>
                    <TrendingUpIcon className="h-5 w-5 text-gold-600 dark:text-gold-400" />
                  </div>
                  <div className="flex-1">
                    <TrendingMiniCard campusId={me?.user?.defaultCampus?.id} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recently viewed */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Recently viewed</h2>
                <Link href="/browse" className="inline-flex items-center gap-1 text-sm font-medium text-forest-700 hover:text-gold-600 dark:text-gold-500 dark:text-cream-100">
                  Browse <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
              <Card>
                <CardContent className="pt-5">
                  <RecentlyViewed />
                </CardContent>
              </Card>
            </div>

            {/* Personal activity: your reviews + messages */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Your reviews</h2>
                </div>
                <Card>
                  <CardContent className="pt-5">
                    <MyReviews />
                  </CardContent>
                </Card>
              </div>
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Messages</h2>
                  <Link href="/messages" className="inline-flex items-center gap-1 text-sm font-medium text-forest-700 hover:text-gold-600 dark:text-gold-500 dark:text-cream-100">
                    View all <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>
                <Card>
                  <CardContent className="pt-5">
                    <MessagesPreview />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Empty states */}
            {wishlistItems.length === 0 && followingItems.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-500/15 text-gold-600 dark:text-gold-400">
                    <SearchIcon className="h-6 w-6" />
                  </span>
                  <p className="text-sm font-medium text-forest-900 dark:text-cream-100">No saved vendors yet</p>
                  <p className="max-w-sm text-xs text-forest-700/60 dark:text-cream-100/60">
                    Browse campus vendors and tap the heart to build your wishlist.
                  </p>
                  <Link href="/browse">
                    <Button variant="gold">Start browsing</Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Sell CTA */}
            <Card className="border-forest-700/15 bg-forest-700/5 dark:border-forest-600 dark:bg-forest-800">
              <CardContent className="flex flex-col items-start justify-between gap-4 py-6 sm:flex-row sm:items-center">
                <div>
                  <p className="font-serif text-lg font-semibold text-forest-900 dark:text-cream-100">Sell on Voeq</p>
                  <p className="mt-1 text-sm text-forest-700/70 dark:text-cream-100/70">Turn your campus audience into customers.</p>
                </div>
                <Link href="/vendor/onboarding/step-1">
                  <Button variant="gold">
                    <TrendingUpIcon className="h-4 w-4" /> Get started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </AnimatedSection>
      </Container>
      {!me?.user?.homeSeenAt && <ShopperWelcomeOverlay firstName={firstName} />}
    </>
  );
}
