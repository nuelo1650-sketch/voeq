# VOEQ — Master Fix Plan (consolidated: defect/rot audit + frontend polish)

Date: 2026-08-15. Two audits merged into ONE autonomous run:
- **Audit A — Defect/Rot** (`AUDIT_ROOT_FINDINGS.md`): correctness, dead code, config drift.
- **Audit B — Frontend Polish** (`AUDIT_FRONTEND_POLISH.md`): dark mode, states, responsive, nav.

Execution order: **correctness/rot first (A1–A9), then polish (B1–B5)**. Each phase: fix → typecheck/build → deploy (Vercel web / Render api) → verify live → report. Nothing ships unverified.

---

## PHASE A — DEFECT / ROT FIXES (from Audit A)

**A1 (HIGH)** Landing hardcoded "10,000+ students" (`for-vendors/page.tsx:67`, `LandingPage.tsx:405`): wire live `GET /api/stats` (exists, `stats.ts:6-16`, mounted `app.ts:161`) into copy, or drop the number (no student metric exists).

**A2 (HIGH)** Placeholder WhatsApp link (`public-group/layout.tsx:117` `WOeqPlaceholder`): make business contact number configurable (env/setting) or hardcode the real one. Not a vendor number.

**A3 (HIGH)** 6 incomplete admin frontend pages (campuses/featured/features/impersonating/profile/system): build against existing admin API routes (`admin/campuses.ts` etc. are REAL), OR remove their nav entries until built. Do NOT drop backend/table.

**A4 (HIGH)** `Request` table = true orphan (no route, no page): build the campus-request feature, or drop table + migration.

**A5 (MEDIUM)** Dead `@voeq/ui` workspace package (zero source imports): remove from workspace, or populate.

**A6 (MEDIUM)** Clean shared `envSchema` (`packages/shared/src/index.ts:43-44,20`): drop stale `UPSTASH_REDIS_REST_*` (old names) + dead `CORS_ORIGINS` (api reads `CORS_ORIGIN` only).

**A7 (MEDIUM)** `ImpersonationBanner` (`ImpersonationBanner.tsx:13` placeholder): wire to real session, or remove.

**A8 (LOW)** `ListingPhoto` raw-SQL join (`search.service.ts:110`) → Prisma relation.

**A9 (LOW)** Dead tables if features abandoned (`AuthIdentity`/`VerificationToken`/`ListingCategory`/`WaitlistEntry`/`Account` — legacy NextAuth): confirm with user before dropping.

## PHASE B — FRONTEND POLISH (from Audit B)

**B1 (CRITICAL POLISH)** Dark mode broken (~70%): **2,070 unpaired light tokens vs 884 `dark:`paired**. Add `dark:` pairs app-wide, start `Button.tsx` (core) + `LandingPage.tsx`, then vendor/admin/public/browse pages. Verify light+dark live.

**B2 (HIGH)** Loading/empty/error states: 65 pages, only 3 `isLoading`, 9 skeletons. Add skeletons + empty states to data pages (browse, vendor/listings, search, buyer-dashboard, notifications, wishlist, following).

**B3 (MEDIUM)** Responsive: 5 fixed-px widths; `grid-cols-2` w/o `sm:/md:` (`signup:56`, `LandingPage:420`, `FirstListingForm:211`, `ListingForm:118`). Convert to breakpoints, kill fixed px.

**B4 (MEDIUM)** Mobile nav: confirm/fix hamburger on main + public nav (`AdminMobileNav.tsx` exists).

**B5 (LOW)** Dead-handler sweep of 182 components (if time; lower risk).

---

## EXECUTION & GUARDRAILS
- Runs **autonomously after sign-off** (user sleeps). Each phase verified live before next.
- Web → Vercel git-push auto-deploy. API → Render deploy (only if A-phase touches api; B is web-only).
- If a phase can't verify live (e.g. browser/Docker unavailable in sandbox), I report the blocker honestly — no "should be fixed" claims.
- A4/A9 touch the DATABASE — migrations need explicit user approval + Windows `prisma migrate deploy` run by user. I will NOT run migrations unsupervised; I'll prepare the migration files + flag for your approval.
- I report a per-phase pass/fail summary on wake.

## SIGN-OFF
[ ] Approve full autonomous run A1–A9 + B1–B5
[ ] Approve A1–A3 + B1–B3 only (stop after core correctness + dark mode + states + responsive)
[ ] Approve A1–A9 only (defects, no polish)
[ ] Adjust scope first
