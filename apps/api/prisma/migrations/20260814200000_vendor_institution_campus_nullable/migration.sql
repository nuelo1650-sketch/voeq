-- Make Vendor.institutionId / campusId nullable.
--
-- Root cause: a Vendor row is created at promotion (POST /api/vendors/upgrade)
-- and at OAuth vendor signup BEFORE the user has chosen their institution /
-- campus in onboarding. The columns were required FKs, so the insert used ''
-- which violated the foreign-key constraint (P2003) and 500'd on every new
-- vendor. Existing vendors keep their values; only the NOT NULL constraint is
-- relaxed so incomplete vendors can be created without a campus yet.

ALTER TABLE "Vendor" ALTER COLUMN "institutionId" DROP NOT NULL;
ALTER TABLE "Vendor" ALTER COLUMN "campusId" DROP NOT NULL;
