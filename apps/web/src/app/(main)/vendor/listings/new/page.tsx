import { type Metadata } from 'next';
import { ListingForm } from '@/components/vendor/ListingForm';
import { requireVendor } from '@/lib/auth-server';
import { VendorPageHeader } from '@/components/vendor/VendorPageShell';

export const metadata: Metadata = {
  title: 'New listing',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function NewListingPage() {
  requireVendor();
  return (
    <>
      <VendorPageHeader title="New listing" subtitle="Post a new item or service for students to discover." />
      <div className="mx-auto max-w-3xl">
        <ListingForm mode="create" />
      </div>
    </>
  );
}
