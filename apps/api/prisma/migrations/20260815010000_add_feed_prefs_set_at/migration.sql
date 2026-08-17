-- Additive, non-destructive migration.
-- 1. Bring User.homeSeenAt into the migration history (already in schema,
--    missing from prior migrations) so `prisma migrate deploy` stays in sync.
-- 2. Add UserPreference.feedPrefsSetAt to gate shopper onboarding completion.

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "homeSeenAt" TIMESTAMP(3);

ALTER TABLE "UserPreference" ADD COLUMN IF NOT EXISTS "feedPrefsSetAt" TIMESTAMP(3);
