-- Drop the dead write-only `currentContext` column and the unused `UserContext` enum.
-- Root cause: `currentContext` was written at signup / OAuth / upgrade but never read
-- by any routing or auth decision (all gates use `role` + Vendor row). It is source
-- of truth duplication and was removed entirely. See docs/architecture-redesign.md.

-- 1. Drop the column (must precede the enum drop: the column depends on the type)
ALTER TABLE "User" DROP COLUMN "currentContext";

-- 2. Drop the now-unreferenced enum type
DROP TYPE "UserContext";
