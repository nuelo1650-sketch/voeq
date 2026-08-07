import { type Metadata } from 'next';
import { ListingForm } from '@/components/vendor/ListingForm';

export const metadata: Metadata = {
  title: 'Edit listing',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditListingPage({ params }: Props) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">
        Edit listing
      </h1>
      <ListingForm mode="edit" listingId={id} />
    </div>
  );
}
