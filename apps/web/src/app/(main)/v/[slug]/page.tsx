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
import { WishlistButton } from '@/components/marketplace/WishlistButton';
import { FollowButton } from '@/components/marketplace/FollowButton';
import { CheckIcon } from '@/components/icons';
import { BadgeList } from '@/components/badges/BadgeList';
import { TrustScore } from '@/components/badges/TrustScore';
import { ReportButton } from '@/components/reports/ReportButton';
import { DisputeButton } from '@/components/reports/DisputeButton';
import { ReviewListWrapper } from '@/components/reviews/ReviewListWrapper';
import { VendorSection } from '@/components/vendor/VendorPageShell';
import { ThreadSeam, ThreadLine } from '@/components/brand/Thread';
import { AnimatedSection } from '@/components/landing/AnimatedSection';
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
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

      <VendorSection>
        <Container size="lg" className="py-6">
          <AnimatedSection>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              {vendor.profilePhotoUrl ? (
                <div className="rounded-full bg-gradient-to-br from-gold-400 to-gold-600 p-0.5">
                  <Image
                    src={vendor.profilePhotoUrl}
                    alt={vendor.businessName}
                    width={96}
                    height={96}
                    className="h-24 w-24 rounded-full object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="rounded-full bg-gradient-to-br from-gold-400 to-gold-600 p-0.5">
                  <Avatar size="xl" alt={vendor.businessName} className="border-0" />
                </div>
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
                <ThreadSeam className="mt-3" />
                <p className="mt-3 text-sm text-forest-700/70 dark:text-cream-100/70">
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
                <WishlistButton vendorId={vendor.id} className="w-full" />
                <FollowButton vendorId={vendor.id} className="w-full" />
                <WhatsAppButton
                  vendorId={vendor.id}
                  vendorName={vendor.businessName}
                  vendorPhone={vendor.whatsappNumber}
                  fullWidth
                />
                <ShareButton url={pageUrl} title={vendor.businessName} fullWidth />
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </VendorSection>

      <VendorSection title="About" className="border-y border-cream-200 bg-cream-50 dark:border-forest-700 dark:bg-forest-800 dark:border-cream-100">
        <Container size="lg" className="py-6">
          <p className="whitespace-pre-wrap text-base text-forest-700/90 dark:text-cream-100/90">{vendor.description}</p>
        </Container>
      </VendorSection>

      {vendor.listings.length > 0 && (
        <>
          <ThreadLine className="max-w-5xl" />
          <VendorSection title={`Listings (${vendor.listings.length})`} className="bg-cream-50 dark:bg-forest-800">
          <Container size="lg" className="py-6">
            <AnimatedSection>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                {vendor.listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            </AnimatedSection>
          </Container>
        </VendorSection>
        </>
      )}

      <VendorSection title="Reviews" className="border-y border-cream-200 dark:border-forest-700 dark:border-cream-100">
        <Container size="lg" className="py-6">
          <AnimatedSection>
            <ReviewListWrapper
              vendorId={vendor.id}
              vendorName={vendor.businessName}
              vendorSlug={vendor.slug}
            />
          </AnimatedSection>
        </Container>
      </VendorSection>

      <VendorSection>
        <Container size="lg" className="py-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <ReportButton vendorId={vendor.id} vendorName={vendor.businessName} />
            <DisputeButton vendorId={vendor.id} vendorName={vendor.businessName} />
          </div>
        </Container>
      </VendorSection>
    </>
  );
}
