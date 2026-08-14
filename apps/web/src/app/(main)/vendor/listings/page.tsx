import { type Metadata } from 'next';
import Link from 'next/link';
import { getMyListings } from '@/lib/vendor-client';
import { requireVendor } from '@/lib/auth-server';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import type { Listing } from '@/lib/vendor-client';
import { VendorPageHeader, VendorSection } from '@/components/vendor/VendorPageShell';
import { AnimatedSection } from '@/components/landing/AnimatedSection';

export const metadata: Metadata = {
  title: 'My listings',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function ListingsPage() {
  requireVendor();
  const { listings } = await getMyListings();

  return (
    <>
      <VendorPageHeader
        title="My listings"
        subtitle="Create and manage the listings students see."
      >
        <Button asChild>
          <Link href="/vendor/listings/new">Add listing</Link>
        </Button>
      </VendorPageHeader>
      <VendorSection>
        <Container size="xl">
          <AnimatedSection>
            <div className="space-y-4">
              {listings.length > 0 ? (
                <div className="space-y-2">
                  {listings.map((l: Listing) => (
                    <div key={l.id} className="flex items-center justify-between rounded-2xl border border-cream-300 bg-cream-50 p-4 dark:border-forest-700 dark:bg-forest-800">
                      <div>
                        <p className="font-medium text-forest-900 dark:text-cream-100">{l.title}</p>
                        <p className="text-xs text-forest-700/60 dark:text-cream-100/60">
                          {l.category.name} · {l.status} · ₦{l.priceMin.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/l/${l.slug}`} target="_blank" className="text-sm text-forest-700 hover:underline dark:text-gold-500">
                          View
                        </Link>
                        <Link href={`/vendor/listings/${l.id}/edit`} className="text-sm text-forest-700 hover:underline dark:text-gold-500">
                          Edit
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-cream-300 bg-cream-50 p-8 text-center dark:border-forest-700 dark:bg-forest-800">
                  <p className="text-sm text-forest-700/70 dark:text-cream-100/70">No listings yet.</p>
                </div>
              )}
            </div>
          </AnimatedSection>
        </Container>
      </VendorSection>
    </>
  );
}
