'use client';

import { useMemo, useState } from 'react';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { HeartIcon } from '@/components/icons';
import { AnimatedSection } from '@/components/landing/AnimatedSection';
import type { WishlistItemSummary } from '@/lib/marketplace-client';

type Tab = 'vendors' | 'listings';

export function WishlistClient({ items }: { items: WishlistItemSummary[] }) {
  const [tab, setTab] = useState<Tab>('vendors');

  const vendors = useMemo(() => items.filter((i) => i.kind === 'vendor'), [items]);
  const listings = useMemo(() => items.filter((i) => i.kind === 'listing'), [items]);

  return (
    <AnimatedSection>
      <div className="mb-6 flex gap-2">
        <TabButton active={tab === 'vendors'} onClick={() => setTab('vendors')}>
          Saved vendors ({vendors.length})
        </TabButton>
        <TabButton active={tab === 'listings'} onClick={() => setTab('listings')}>
          Saved listings ({listings.length})
        </TabButton>
      </div>

      {tab === 'vendors' ? (
        vendors.length === 0 ? (
          <EmptyState
            icon={<HeartIcon className="h-16 w-16 text-forest-700/30 dark:text-cream-100/30" />}
            title="No saved vendors yet"
            description="Tap the heart icon on any vendor to save them for later."
            action={{ label: 'Browse vendors', onClick: () => { window.location.href = '/browse'; } }}
          />
        ) : (
          <Grid itemKind="vendor" items={vendors} />
        )
      ) : listings.length === 0 ? (
        <EmptyState
          icon={<HeartIcon className="h-16 w-16 text-forest-700/30 dark:text-cream-100/30" />}
          title="No saved listings yet"
          description="Tap the heart on any listing to save it for later."
          action={{ label: 'Browse listings', onClick: () => { window.location.href = '/browse'; } }}
        />
      ) : (
        <Grid itemKind="listing" items={listings} />
      )}
    </AnimatedSection>
  );
}

function Grid({ itemKind, items }: { itemKind: 'vendor' | 'listing'; items: WishlistItemSummary[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {items.map((item) => {
        if (itemKind === 'vendor') {
          const v = (item as Extract<WishlistItemSummary, { kind: 'vendor' }>).vendor;
          const listing = v.listings?.[0];
          if (!listing) return null;
          return (
            <ListingCard
              key={item.id}
              listing={{
                id: listing.id,
                slug: listing.slug,
                title: listing.title,
                description: listing.description,
                priceMin: Number(listing.priceMin),
                priceMax: listing.priceMax ? Number(listing.priceMax) : null,
                photoUrl: listing.photoUrl,
                categoryName: listing.categoryName,
                categorySlug: listing.categorySlug,
                vendorName: v.businessName,
                vendorSlug: v.businessSlug,
                campusName: v.campus.name,
              }}
            />
          );
        }
        const l = (item as Extract<WishlistItemSummary, { kind: 'listing' }>).listing;
        return (
          <ListingCard
            key={item.id}
            listing={{
              id: l.id,
              slug: l.slug,
              title: l.title,
              description: l.description,
              priceMin: Number(l.priceMin),
              priceMax: l.priceMax ? Number(l.priceMax) : null,
              photoUrl: l.photoUrl,
              categoryName: l.categoryName,
              categorySlug: l.categorySlug,
              vendorName: l.vendorName,
              vendorSlug: l.vendorSlug,
              campusName: l.campusName ?? '',
            }}
          />
        );
      })}
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        active
          ? 'bg-forest-700 text-cream-100 dark:bg-forest-800 dark:text-cream-100'
          : 'border border-cream-300 bg-cream-50 text-forest-700 hover:border-forest-700/30 dark:border-forest-700 dark:bg-forest-800 dark:text-cream-100'
      }`}
    >
      {children}
    </button>
  );
}
