import { redirect } from 'next/navigation';
import { serverGetMe as getMe } from '@/lib/auth-server';
import { serverGetWishlist as getWishlist } from '@/lib/marketplace-server';
import { Container } from '@/components/ui/Container';
import { VendorPageHeader, VendorSection } from '@/components/vendor/VendorPageShell';
import { WishlistClient } from './WishlistClient';
import type { WishlistItemSummary } from '@/lib/marketplace-client';

export const metadata = {
  title: 'Wishlist',
  robots: { index: false, follow: false },
};

export default async function WishlistPage() {
  const me = await getMe().catch(() => null);
  if (!me?.user) {
    redirect('/signin');
  }

  const { items } = await getWishlist().catch(() => ({ items: [] as WishlistItemSummary[] }));

  return (
    <>
      <VendorPageHeader title="Wishlist" subtitle="Vendors and listings you've saved for later" />
      <VendorSection>
        <Container size="lg">
          <WishlistClient items={items} />
        </Container>
      </VendorSection>
    </>
  );
}
