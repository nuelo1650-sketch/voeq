-- Drop 6 confirmed-orphan tables/enums (zero code references, no relations to live tables).
-- CASCADE removes any stray FKs. Safe: does NOT touch User/Listing/Institution/etc.
DROP TABLE IF EXISTS "Request" CASCADE;
DROP TABLE IF EXISTS "AuthIdentity" CASCADE;
DROP TABLE IF EXISTS "Account" CASCADE;
DROP TABLE IF EXISTS "VerificationToken" CASCADE;
DROP TABLE IF EXISTS "WaitlistEntry" CASCADE;
DROP TYPE IF EXISTS "RequestStatus" CASCADE;
