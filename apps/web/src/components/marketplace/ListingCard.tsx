import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PriceRange } from './PriceRange';
import { ListingSaveButton } from './ListingSaveButton';
import type { ListingSummary } from '@/lib/marketplace-client';

interface ListingCardProps {
  listing: ListingSummary;
  className?: string;
}

export function ListingCard({ listing, className }: ListingCardProps) {
  return (
    <Link
      href={`/l/${listing.slug}` as unknown as string}
      className={cn(
        'group flex flex-col overflow-hidden rounded-2xl border border-cream-300 bg-cream-50 transition',
        'hover:border-forest-700/30 hover:shadow-md',
        'dark:border-forest-700 dark:bg-forest-800 dark:hover:border-cream-100/20',
        className,
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-cream-200 dark:bg-forest-700">
        <ListingSaveButton
          listingId={listing.id}
          showLabel={false}
          className="absolute right-2 top-2 z-10 bg-cream-50/90 backdrop-blur dark:bg-forest-800/90"
        />
        {listing.photoUrl ? (
          <Image
            src={listing.photoUrl}
            alt={listing.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-gradient-to-br from-forest-700 to-forest-900 text-cream-100/40 dark:from-forest-800 dark:to-forest-950">
            <span className="font-serif text-4xl font-semibold text-cream-100/30">
              {listing.title?.charAt(0)?.toUpperCase() ?? 'V'}
            </span>
            <span className="text-[10px] uppercase tracking-wide">No photo yet</span>
          </div>
        )}
        {listing.isFlashDeal && (
          <div className="absolute left-2 top-2">
            <span className="rounded-full bg-gold-600 px-2 py-0.5 text-xs font-semibold text-white">Flash deal</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-1 text-sm font-semibold text-forest-900 dark:text-cream-100">
          {listing.title}
        </h3>
        <p className="line-clamp-1 text-xs text-forest-700/60 dark:text-cream-100/60">
          {listing.vendorName} · {listing.campusName}
        </p>
        <div className="mt-auto pt-2">
          <PriceRange min={listing.priceMin} max={listing.priceMax} size="sm" />
        </div>
      </div>
    </Link>
  );
}
