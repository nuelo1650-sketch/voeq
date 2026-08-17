import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getListing } from '@/lib/marketplace-client';
import { buildMetadata } from '@/lib/seo';
import { Container } from '@/components/ui/Container';
import { PhotoGallery } from '@/components/marketplace/PhotoGallery';
import { PriceRange } from '@/components/marketplace/PriceRange';
import { WhatsAppButton } from '@/components/marketplace/WhatsAppButton';
import { ShareButton } from '@/components/marketplace/ShareButton';
import { ListingSaveButton } from '@/components/marketplace/ListingSaveButton';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { RatingStars } from '@/components/marketplace/RatingStars';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { VendorSection } from '@/components/vendor/VendorPageShell';
import { AnimatedSection } from '@/components/landing/AnimatedSection';

interface ListingPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getListing(slug).catch(() => null);
  if (!result) {
    return buildMetadata({ title: 'Listing not found', noIndex: true });
  }
  const { listing } = result;
  return buildMetadata({
    title: listing.title,
    description: listing.description.slice(0, 160),
    path: `/l/${listing.slug}`,
    keywords: [listing.category.name, listing.vendor.businessName, listing.vendor.campus.name],
  });
}

export const dynamic = 'force-dynamic';

export default async function ListingPage({ params }: ListingPageProps) {
  const { slug } = await params;
  const result = await getListing(slug).catch(() => null);
  if (!result) notFound();

  const { listing } = result;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const pageUrl = `${siteUrl}/l/${listing.slug}`;
  const priceStr = listing.priceMax
    ? `₦${listing.priceMin.toLocaleString('en-NG')} – ₦${listing.priceMax.toLocaleString('en-NG')}`
    : `₦${listing.priceMin.toLocaleString('en-NG')}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: listing.title,
    description: listing.description,
    image: listing.photos[0]?.url,
    brand: { '@type': 'Brand', name: listing.vendor.businessName },
    offers: {
      '@type': 'Offer',
      price: listing.priceMin,
      priceCurrency: 'NGN',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <VendorSection>
        <Container size="lg" className="py-6">
          <AnimatedSection>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <PhotoGallery photos={listing.photos} alt={listing.title} />

              <div className="space-y-6">
                <div>
                  <Link
                    href={`/browse?category=${listing.category.slug}`}
                    className="text-xs font-medium text-gold-600 hover:underline"
                  >
                    {listing.category.name}
                  </Link>
                  <h1 className="mt-2 font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100 sm:text-4xl">
                    {listing.title}
                  </h1>
                  {listing.isFlashDeal && (
                    <div className="mt-2">
                      <Badge variant="gold">Flash deal</Badge>
                    </div>
                  )}
                </div>

                <PriceRange min={listing.priceMin} max={listing.priceMax} size="lg" />

                <div className="rounded-2xl border border-cream-300 bg-cream-50 p-4 dark:border-forest-700 dark:bg-forest-800 dark:border-cream-100">
                  <Link
                    href={`/v/${listing.vendor.slug}`}
                    className="flex items-center gap-3"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-forest-900 dark:text-cream-100">
                        {listing.vendor.businessName}
                      </p>
                      <p className="text-xs text-forest-700/60 dark:text-cream-100/60">
                        {listing.vendor.campus.name}
                      </p>
                      {listing.vendor.ratingCount > 0 && (
                        <div className="mt-1">
                          <RatingStars rating={listing.vendor.ratingAvg} count={listing.vendor.ratingCount} size="sm" />
                        </div>
                      )}
                    </div>
                  </Link>
                </div>

                <div className="space-y-3">
                  <WhatsAppButton
                    vendorId={listing.vendor.id}
                    vendorName={listing.vendor.businessName}
                    vendorPhone={listing.vendor.whatsappNumber}
                    listingId={listing.id}
                    listingTitle={listing.title}
                    listingPrice={priceStr}
                    fullWidth
                  />
                  <ListingSaveButton listingId={listing.id} fullWidth />
                  <ShareButton
                    url={pageUrl}
                    title={listing.title}
                    text={`Check out ${listing.title} on Voeq`}
                    fullWidth
                  />
                </div>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </VendorSection>

      <VendorSection title="Description" className="border-y border-cream-200 bg-cream-50 dark:border-forest-700 dark:bg-forest-800 dark:border-cream-100">
        <Container size="lg" className="py-6">
          <p className="whitespace-pre-wrap text-base text-forest-700/90 dark:text-cream-100/90">{listing.description}</p>
        </Container>
      </VendorSection>

      {listing.related.length > 0 && (
        <VendorSection title={`More in ${listing.category.name}`} className="bg-cream-50 dark:bg-forest-800">
          <Container size="lg" className="py-6">
            <AnimatedSection>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
                {listing.related.map((related) => (
                  <ListingCard
                    key={related.id}
                    listing={{
                      id: related.id,
                      slug: related.slug,
                      title: related.title,
                      description: '',
                      priceMin: related.priceMin,
                      priceMax: null,
                      photoUrl: related.photoUrl,
                      categoryName: listing.category.name,
                      categorySlug: listing.category.slug,
                      vendorName: listing.vendor.businessName,
                      vendorSlug: listing.vendor.slug,
                      campusName: listing.vendor.campus.name,
                    }}
                  />
                ))}
              </div>
            </AnimatedSection>
          </Container>
        </VendorSection>
      )}
    </>
  );
}
