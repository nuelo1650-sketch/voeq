'use client';

import Link from 'next/link';
import { EmptySearch } from '@/components/illustrations';

export function EmptySearchResults() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <EmptySearch className="h-40 w-40 text-forest-700/40 dark:text-cream-100/40" />
      <h3 className="mt-6 font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">No results found</h3>
      <p className="mt-2 max-w-md text-sm text-forest-700/70 dark:text-cream-100/70">
        Try adjusting your search or filters, or browse all categories.
      </p>
      <Link href="/browse" className="mt-6 text-sm font-medium text-gold-600 hover:underline">
        Browse all listings
      </Link>
    </div>
  );
}
