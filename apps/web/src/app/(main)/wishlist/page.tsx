import { type Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getMe } from '@/lib/auth-client';
import { getWishlist } from '@/lib/marketplace-client';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { HeartIcon } from '@/components/icons';
import { VendorPageHeader, VendorSection } from '@/components/vendor/VendorPageShell';
import { AnimatedSection } from '@/components/landing/AnimatedSection';

export const metadata: Metadata = {
  title: 'Wishlist',
  robots: { index: false, follow: false },
};

export default async function WishlistPage() {
  const me = await getMe().catch(() => null);
  if (!me?.user) {
    redirect('/signin');
  }

  const { items } = await getWishlist().catch(() => ({ items: [] }));

  return (
    <>
      <VendorPageHeader title="Wishlist" subtitle="Vendors you've saved for later" />
      <VendorSection>
        <Container size="lg">
          <AnimatedSection>
            {items.length === 0 ? (
              <EmptyState
                icon={<HeartIcon className="h-16 w-16 text-forest-700/30 dark:text-cream-100/30" />}
                title="No saved vendors yet"
                description="Tap the heart icon on any vendor to save them for later."
                action={{
                  label: 'Browse vendors',
                  onClick: () => { window.location.href = '/browse'; },
                }}
              />
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                {items.map((item: any) => {
                  const listing = item.vendor?.listings?.[0];
                  if (!listing) return null;
                  return (
                    <ListingCard
                      key={item.id}
                      listing={{
                        id: listing.id,
                        slug: listing.slug,
                        title: listing.title,
                        description: listing.description,
                        priceMin: Number(listing.priceMin),
                        priceMax: listing.priceMax ? Number(listing.priceMax) : null,
                        photoUrl: listing.photoUrl,
                        categoryName: listing.categoryName,
                        categorySlug: listing.categorySlug,
                        vendorName: item.vendor.businessName,
                        vendorSlug: item.vendor.slug,
                        campusName: item.vendor.campus.name,
                      }}
                    />
                  );
                })}
              </div>
            )}
          </AnimatedSection>
        </Container>
      </VendorSection>
    </>
  );
}
