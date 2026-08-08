import { type Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getMe } from '@/lib/auth-client';
import { getFollowing } from '@/lib/marketplace-client';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { CheckIcon } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Following',
  robots: { index: false, follow: false },
};

export default async function FollowingPage() {
  const me = await getMe().catch(() => null);
  if (!me?.user) {
    redirect('/signin');
  }

  const { follows } = await getFollowing().catch(() => ({ follows: [] }));

  return (
    <Section spacing="md">
      <Container size="lg">
        <div className="mb-6">
          <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">Following</h1>
          <p className="mt-1 text-sm text-forest-700/70 dark:text-cream-100/70">Vendors you follow for updates</p>
        </div>

        {follows.length === 0 ? (
          <EmptyState
            icon={<CheckIcon className="h-16 w-16 text-forest-700/30 dark:text-cream-100/30" />}
            title="Not following anyone yet"
            description="Tap the follow button on any vendor to get notified of new listings."
            action={{
              label: 'Browse vendors',
              onClick: () => { window.location.href = '/browse'; },
            }}
          />
        ) : (
          <div className="space-y-6">
            {follows.map((follow: any) => (
              <div key={follow.id} className="rounded-2xl border border-cream-300 bg-cream-50 p-6 dark:border-forest-700 dark:bg-forest-800">
                <Link href={`/v/${follow.vendor.slug}`} className="text-lg font-semibold text-forest-900 hover:text-forest-700 dark:text-cream-100">
                  {follow.vendor.businessName}
                </Link>
                <p className="mt-1 text-sm text-forest-700/60 dark:text-cream-100/60">
                  {follow.vendor.institution.name} · {follow.vendor.campus.name}
                </p>
                {follow.vendor.listings?.[0] && (
                  <div className="mt-4">
                    <ListingCard
                      listing={{
                        id: follow.vendor.listings[0].id,
                        slug: follow.vendor.listings[0].slug,
                        title: follow.vendor.listings[0].title,
                        description: follow.vendor.listings[0].description,
                        priceMin: Number(follow.vendor.listings[0].priceMin),
                        priceMax: follow.vendor.listings[0].priceMax ? Number(follow.vendor.listings[0].priceMax) : null,
                        photoUrl: follow.vendor.listings[0].photoUrl,
                        categoryName: follow.vendor.listings[0].categoryName,
                        categorySlug: follow.vendor.listings[0].categorySlug,
                        vendorName: follow.vendor.businessName,
                        vendorSlug: follow.vendor.slug,
                        campusName: follow.vendor.campus.name,
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
