import { type Metadata } from 'next';
import Link from 'next/link';
import { getMyListings } from '@/lib/vendor-client';
import { Button } from '@/components/ui/Button';
import type { Listing } from '@/lib/vendor-client';

export const metadata: Metadata = {
  title: 'My listings',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function ListingsPage() {
  const { listings } = await getMyListings();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">
          My listings
        </h1>
        <Button>
          <Link href="/vendor/listings/new">Add listing</Link>
        </Button>
      </div>

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
        <p className="text-sm text-forest-700/60 dark:text-cream-100/60">
          No listings yet.
        </p>
      )}
    </div>
  );
}
