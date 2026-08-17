-- Extend WishlistItem to support per-listing saves alongside vendor saves.
-- Additive, non-destructive. Both save kinds coexist via two partial unique
-- constraints (a vendor-save row has listingId NULL; a listing-save row has
-- vendorId NULL), so a user can't double-save either kind.

-- 1. Nullable listingId column on WishlistItem.
ALTER TABLE "WishlistItem" ADD COLUMN IF NOT EXISTS "listingId" TEXT;

-- 2. Foreign key to Listing (cascade delete if the listing is removed).
ALTER TABLE "WishlistItem"
  DROP CONSTRAINT IF EXISTS "WishlistItem_listingId_fkey";
ALTER TABLE "WishlistItem"
  ADD CONSTRAINT "WishlistItem_listingId_fkey"
  FOREIGN KEY ("listingId") REFERENCES "Listing"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- 3. Partial unique so a user can save a given listing at most once.
--    (The existing userId_vendorId unique already covers vendor saves;
--     vendorId is nullable so it never collides with listing-save rows.)
CREATE UNIQUE INDEX IF NOT EXISTS "WishlistItem_userId_listingId_key"
  ON "WishlistItem" ("userId", "listingId");
