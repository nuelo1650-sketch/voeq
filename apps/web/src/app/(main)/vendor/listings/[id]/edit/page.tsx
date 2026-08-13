import { type Metadata } from 'next';
import { ListingForm } from '@/components/vendor/ListingForm';
import { VendorPageHeader } from '@/components/vendor/VendorPageShell';

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
    <>
      <VendorPageHeader title="Edit listing" subtitle="Update the details students see on this listing." />
      <div className="mx-auto max-w-3xl">
        <ListingForm mode="edit" listingId={id} />
      </div>
    </>
  );
}
