import { type Metadata } from 'next';
import { ListingForm } from '@/components/vendor/ListingForm';

export const metadata: Metadata = {
  title: 'New listing',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function NewListingPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">
        New listing
      </h1>
      <ListingForm mode="create" />
    </div>
  );
}
