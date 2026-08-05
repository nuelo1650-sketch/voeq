import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import { StarIcon, CheckIcon } from '@/components/icons';

interface VendorCardProps {
  vendor: {
    id: string;
    slug: string;
    businessName: string;
    description: string;
    photoUrl: string | null;
    campusName: string;
    ratingAvg: number;
    ratingCount: number;
    verifiedBadge?: boolean;
  };
  className?: string;
}

export function VendorCard({ vendor, className }: VendorCardProps) {
  return (
    <Link
      href={`/v/${vendor.slug}` as unknown as string}
      className={cn(
        'group flex flex-col gap-3 rounded-2xl border border-cream-300 bg-cream-50 p-4 transition',
        'hover:border-forest-700/30 hover:shadow-md',
        'dark:border-forest-700 dark:bg-forest-800 dark:hover:border-cream-100/20',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        {vendor.photoUrl ? (
          <Image
            src={vendor.photoUrl}
            alt={vendor.businessName}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover"
            loading="lazy"
          />
        ) : (
          <Avatar size="md" alt={vendor.businessName} />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-sm font-semibold text-forest-900 dark:text-cream-100">
              {vendor.businessName}
            </h3>
            {vendor.verifiedBadge && (
              <CheckIcon className="h-4 w-4 text-gold-600 flex-shrink-0" aria-label="Verified" />
            )}
          </div>
          <p className="truncate text-xs text-forest-700/60 dark:text-cream-100/60">
            {vendor.campusName}
          </p>
        </div>
      </div>
      <p className="line-clamp-2 text-xs text-forest-700/70 dark:text-cream-100/70">
        {vendor.description}
      </p>
      {vendor.ratingCount > 0 && (
        <div className="flex items-center gap-1.5 text-xs">
          <StarIcon className="h-3.5 w-3.5 text-gold-600" filled />
          <span className="font-medium text-forest-900 dark:text-cream-100">
            {vendor.ratingAvg.toFixed(1)}
          </span>
          <span className="text-forest-700/60 dark:text-cream-100/60">
            ({vendor.ratingCount})
          </span>
        </div>
      )}
    </Link>
  );
}
