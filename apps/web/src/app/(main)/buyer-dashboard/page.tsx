import { type Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getMe } from '@/lib/auth-client';
import { getWishlist, getFollowing } from '@/lib/marketplace-client';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { HeartIcon, CheckIcon, ChatIcon, SearchIcon, TrendingUpIcon } from '@/components/icons';
import { formatDistanceToNow } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
};

export default async function BuyerDashboardPage() {
  const me = await getMe().catch(() => null);
  if (!me?.user) {
    redirect('/signin');
  }

  const [wishlistData, followingData] = await Promise.all([
    getWishlist().catch(() => ({ items: [] })),
    getFollowing().catch(() => ({ follows: [] })),
  ]);

  const wishlistItems = wishlistData.items.slice(0, 4);
  const followingItems = followingData.follows.slice(0, 4);

  return (
    <Section spacing="md">
      <Container size="lg">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">
            Welcome back, {me?.user.name?.split(' ')[0] ?? 'there'}
          </h1>
          <p className="mt-1 text-sm text-forest-700/70 dark:text-cream-100/70">
            Your activity on Voeq
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          <Link href="/wishlist" className="group">
            <Card className="transition group-hover:border-forest-700/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <HeartIcon className="h-8 w-8 text-forest-700" />
                  <span className="font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">
                    {wishlistData.items.length}
                  </span>
                </div>
                <p className="mt-3 text-sm font-medium text-forest-900 dark:text-cream-100">Saved vendors</p>
                <p className="mt-1 text-xs text-forest-700/60 dark:text-cream-100/60">View your wishlist</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/following" className="group">
            <Card className="transition group-hover:border-forest-700/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <CheckIcon className="h-8 w-8 text-forest-700" />
                  <span className="font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">
                    {followingData.follows.length}
                  </span>
                </div>
                <p className="mt-3 text-sm font-medium text-forest-900 dark:text-cream-100">Following</p>
                <p className="mt-1 text-xs text-forest-700/60 dark:text-cream-100/60">Vendors you follow</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="opacity-60">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <ChatIcon className="h-8 w-8 text-forest-700/40" />
                <span className="text-xs font-medium uppercase tracking-wide text-forest-700/40">Soon</span>
              </div>
              <p className="mt-3 text-sm font-medium text-forest-900/60 dark:text-cream-100/60">Messages</p>
              <p className="mt-1 text-xs text-forest-700/60 dark:text-cream-100/60">Coming in Phase 2</p>
            </CardContent>
          </Card>
        </div>

        {wishlistItems.length > 0 && (
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Recently saved</h2>
              <Link href="/wishlist" className="text-sm font-medium text-forest-700 hover:underline dark:text-gold-500">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {wishlistItems.map((item: any) => (
                <Link
                  key={item.id}
                  href={`/v/${item.vendor.businessSlug}`}
                  className="rounded-2xl border border-cream-300 bg-cream-50 p-4 transition hover:border-forest-700/30 dark:border-forest-700 dark:bg-forest-800"
                >
                  <p className="font-medium text-forest-900 dark:text-cream-100">{item.vendor.businessName}</p>
                  <p className="mt-1 text-xs text-forest-700/60 dark:text-cream-100/60">
                    {item.vendor.campus?.name} · Added {formatDistanceToNow(new Date(item.createdAt))} ago
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {followingItems.length > 0 && (
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Following</h2>
              <Link href="/following" className="text-sm font-medium text-forest-700 hover:underline dark:text-gold-500">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {followingItems.map((follow: any) => (
                <Link
                  key={follow.id}
                  href={`/v/${follow.vendor.businessSlug}`}
                  className="rounded-2xl border border-cream-300 bg-cream-50 p-4 transition hover:border-forest-700/30 dark:border-forest-700 dark:bg-forest-800"
                >
                  <p className="font-medium text-forest-900 dark:text-cream-100">{follow.vendor.businessName}</p>
                  <p className="mt-1 text-xs text-forest-700/60 dark:text-cream-100/60">
                    {follow.vendor.campus?.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <Link href="/browse" className="group">
            <Card className="transition group-hover:border-forest-700/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <SearchIcon className="h-6 w-6 text-forest-700" />
                  <div>
                    <p className="text-sm font-medium text-forest-900 dark:text-cream-100">Browse vendors</p>
                    <p className="text-xs text-forest-700/60 dark:text-cream-100/60">Find what you need</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/become-vendor" className="group">
            <Card className="transition group-hover:border-forest-700/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <TrendingUpIcon className="h-6 w-6 text-forest-700" />
                  <div>
                    <p className="text-sm font-medium text-forest-900 dark:text-cream-100">Have a business?</p>
                    <p className="text-xs text-forest-700/60 dark:text-cream-100/60">List it on Voeq</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
