-- AlterTable: vendor onboarding fields
ALTER TABLE "Vendor" ADD COLUMN "onboardingProgress" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Vendor" ADD COLUMN "lastDraftSavedAt" TIMESTAMP(3);

-- AlterTable: listing draft fields
ALTER TABLE "Listing" ADD COLUMN "draftData" JSONB;
ALTER TABLE "Listing" ADD COLUMN "lastDraftSavedAt" TIMESTAMP(3);
