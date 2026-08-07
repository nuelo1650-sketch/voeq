import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getVendor } from '@/lib/marketplace-client';
import { getVendorBadges } from '@/lib/badge-client';
import { buildMetadata } from '@/lib/seo';
import { Container } from '@/components/ui/Container';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { WhatsAppButton } from '@/components/marketplace/WhatsAppButton';
import { ShareButton } from '@/components/marketplace/ShareButton';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { RatingStars } from '@/components/marketplace/RatingStars';
import { CheckIcon } from '@/components/icons';
import { BadgeList } from '@/components/badges/BadgeList';
import { TrustScore } from '@/components/badges/TrustScore';
import { ReportButton } from '@/components/reports/ReportButton';
import { ReviewListWrapper } from '@/components/reviews/ReviewListWrapper';
import Image from 'next/image';

interface VendorPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: VendorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getVendor(slug).catch(() => null);
  if (!result) {
    return buildMetadata({ title: 'Vendor not found', noIndex: true });
  }
  const { vendor } = result;
  return buildMetadata({
    title: vendor.businessName,
    description: vendor.description.slice(0, 160),
    path: `/v/${vendor.slug}`,
    keywords: [vendor.businessName, vendor.campus.name, vendor.institution.name],
  });
}

export const dynamic = 'force-dynamic';

export default async function VendorPage({ params }: VendorPageProps) {
  const { slug } = await params;
  const result = await getVendor(slug).catch(() => null);
  if (!result) notFound();

  const { vendor } = result;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const pageUrl = `${siteUrl}/v/${vendor.slug}`;

  const vendorBadges = await getVendorBadges(vendor.id).catch(() => ({ badges: [] }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: vendor.businessName,
    description: vendor.description,
    image: vendor.profilePhotoUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: vendor.campus.name,
      addressCountry: 'NG',
    },
    aggregateRating: vendor.ratingCount > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: vendor.ratingAvg,
      reviewCount: vendor.ratingCount,
    } : undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Container size="lg" className="py-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {vendor.profilePhotoUrl ? (
            <Image
              src={vendor.profilePhotoUrl}
              alt={vendor.businessName}
              width={96}
              height={96}
              className="h-24 w-24 rounded-full object-cover"
              priority
            />
          ) : (
            <Avatar size="xl" alt={vendor.businessName} />
          )}

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100 sm:text-4xl">
                {vendor.businessName}
              </h1>
              {vendor.verifiedBadge && (
                <Badge variant="gold" className="gap-1">
                  <CheckIcon className="h-3 w-3" /> Verified
                </Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-forest-700/70 dark:text-cream-100/70">
              {vendor.institution.name} · {vendor.campus.name}
            </p>
            {vendor.ratingCount > 0 && (
              <div className="mt-2">
                <RatingStars rating={vendor.ratingAvg} count={vendor.ratingCount} size="md" />
              </div>
            )}
            <div className="mt-2">
              <TrustScore score={vendor.trustScore} size="sm" showLabel={false} />
              <p className="mt-1 text-xs text-forest-700/60 dark:text-cream-100/60">
                Trust score: <span className="font-semibold text-forest-900 dark:text-cream-100">{vendor.trustScore}/100</span>
              </p>
            </div>
            {vendorBadges.badges.length > 0 && (
              <div className="mt-4">
                <BadgeList badges={vendorBadges.badges} size="sm" />
              </div>
            )}
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[200px]">
            <WhatsAppButton
              vendorId={vendor.id}
              vendorName={vendor.businessName}
              listingUrl={pageUrl}
              fullWidth
            />
            <ShareButton url={pageUrl} title={vendor.businessName} fullWidth />
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-cream-300 bg-cream-50 p-6 dark:border-forest-700 dark:bg-forest-800">
          <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">About</h2>
          <p className="mt-2 whitespace-pre-wrap text-base text-forest-700/90 dark:text-cream-100/90">
            {vendor.description}
          </p>
        </div>

        {vendor.listings.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-4 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">
              Listings ({vendor.listings.length})
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {vendor.listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-12">
          <ReviewListWrapper
            vendorId={vendor.id}
            vendorName={vendor.businessName}
            vendorSlug={vendor.slug}
          />
        </div>

        <div className="mt-8 text-center">
          <ReportButton vendorId={vendor.id} vendorName={vendor.businessName} />
        </div>
      </Container>
    </>
  );
}
