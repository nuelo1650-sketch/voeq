-- Phase 3 schema: nested categories, vendor city/state, multi-category listings.
-- Additive only. Does NOT touch the unrelated AuthTokenPurpose drift.

-- 1. Category: image + nesting
ALTER TABLE "Category" ADD COLUMN "imagePublicId" TEXT;
ALTER TABLE "Category" ADD COLUMN "imageUrl" TEXT;
ALTER TABLE "Category" ADD COLUMN "parentCategoryId" TEXT;
CREATE INDEX "Category_parentCategoryId_idx" ON "Category"("parentCategoryId");
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentCategoryId_fkey"
  FOREIGN KEY ("parentCategoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- 2. Vendor: location for campus-less sellers
ALTER TABLE "Vendor" ADD COLUMN "city" TEXT;
ALTER TABLE "Vendor" ADD COLUMN "state" TEXT;

-- 3. Listing.categoryId becomes optional (primary category denormalized; join table is source of truth)
ALTER TABLE "Listing" ALTER COLUMN "categoryId" DROP NOT NULL;

-- 4. ListingCategory join table (many-to-many, with primary flag)
CREATE TABLE "ListingCategory" (
  "id" TEXT NOT NULL,
  "listingId" TEXT NOT NULL,
  "categoryId" TEXT NOT NULL,
  "isPrimary" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ListingCategory_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ListingCategory_listingId_categoryId_key" ON "ListingCategory"("listingId", "categoryId");
CREATE INDEX "ListingCategory_categoryId_idx" ON "ListingCategory"("categoryId");
CREATE INDEX "ListingCategory_listingId_idx" ON "ListingCategory"("listingId");
ALTER TABLE "ListingCategory" ADD CONSTRAINT "ListingCategory_listingId_fkey"
  FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ListingCategory" ADD CONSTRAINT "ListingCategory_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 5. Backfill: every existing listing's single category becomes its primary join row.
INSERT INTO "ListingCategory" ("id", "listingId", "categoryId", "isPrimary", "createdAt")
SELECT
  'lc_' || "id",
  "id",
  "categoryId",
  true,
  "createdAt"
FROM "Listing"
WHERE "categoryId" IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM "ListingCategory" lc WHERE lc."listingId" = "Listing"."id" AND lc."categoryId" = "Listing"."categoryId"
  );
