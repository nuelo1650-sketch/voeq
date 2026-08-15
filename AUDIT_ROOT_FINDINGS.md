# VOEQ — Full-Scope Root Audit (findings + file:line evidence)

Date: 2026-08-15. Scope: entire monorepo — web (17.7k LOC), api (7.8k LOC), shared, ui, config. Method: direct targeted root-trace (subagent open-ended sweeps timed out at 600s; this is the reliable path). Verification-first: every claim cites file:line.

Severity: **CRITICAL** (security/data loss / broken in prod) · **HIGH** (dead feature / misleading UX / config rot that bites) · **MEDIUM** (drift / dead code / hygiene) · **LOW** (cosmetic).

---

## BATCH 2 — BACKEND STRUCTURE / DB / ENUMS / ENV  ✅ mostly clean
- Routes: all 30 router files mounted in `app.ts` (directly or via `routes/index.ts`, `routes/admin/index.ts`). 0 orphan routes.
- Rate-limit: all routes use `rateLimitWithFallback` (Upstash). 0 in-memory `rateLimit({` calls remain. `auth.ts` only keeps `trackFailure` from in-memory file (intended lockout helper). ✅
- Email external calls guarded (email.service.ts:114-125 try/catch). ✅
- Enums: all `UserRole` (buyer/vendor/moderator/admin/super_admin), `UserStatus`, `VendorStatus` values referenced in code — no dead enum values. ✅

## BATCH 1 — DB SCHEMA DRIFT  ⚠️ HIGH/MEDIUM
Schema read fully (787 lines). Models used in code match schema (case-insensitive). **Orphan/dead tables (defined, ~0 app code paths):**
- `Request` (campus-request feature) — 0 real refs. **HIGH** (feature unbuilt, table dead).
- `AuthIdentity` — 0 refs. **MEDIUM**.
- `VerificationToken` — 0 refs (OTP uses `AuthToken`). **MEDIUM**.
- `ListingCategory` (multi-category) — 0 refs (Listings use single `categoryId`). **MEDIUM**.
- `WaitlistEntry` — 0 refs. **LOW**.
- `Account` (NextAuth-style) — 1 type-only ref, 0 writes. **LOW** (legacy NextAuth artifact; you use custom JWT).
- `ListingPhoto` written only via raw SQL join in search.service.ts:110 (not via Prisma relation) — fragile but functional. **MEDIUM**.

## BATCH 3 — FRONTEND  ⚠️ HIGH (your pet-hate findings)
- **Hardcoded vanity metric** (you explicitly hate these): `for-vendors/page.tsx:67` + `LandingPage.tsx:405` claim **"Reach 10,000+ students"** — static string, not DB-derived. **HIGH** (misleading claim).
- **6 dead admin stub pages** (each ~20 lines, just `<p>…placeholder.</p>`): `admin/campuses`, `admin/featured`, `admin/features`, `admin/impersonating`, `admin/profile`, `admin/system`. Nav links to them exist but they do nothing. **HIGH** (dead buttons / fake admin surfaces).
- **Placeholder WhatsApp link in prod**: `public-group/layout.tsx:117` `href="https://wa.me/message/WOeqPlaceholder"` — broken real link. **HIGH**.
- `ImpersonationBanner.tsx:13` — comment "Placeholder: in real auth context, set from JWT/cookie" → impersonation UI not wired to real session. **MEDIUM**.
- Frontend auth gate (`middleware.ts`) — **CORRECT**: unauth→/signin, wrong-role /vendor→/become-vendor, /admin→/home, `postAuthDestination` routes by role+vendorStatus (live→/vendor, incomplete→/vendor/onboarding/step-1). ✅
- Routing: 68 routes; all real internal links resolve (only false-positives: `/brand/voeq-mark`, `/favicon-192`, `/Name` = assets). 0 dead links. ✅

## BATCH 4 — SHARED / UI / CONFIG  ⚠️ MEDIUM
- **`@voeq/ui` is an EMPTY dead package**: `packages/ui/src/index.ts` = `export {};`. Nothing imports it; web uses its own `apps/web/src/components` (182 files). **MEDIUM** (schema rot — scaffold placeholder never filled).
- **Stale env in shared `envSchema`** (`packages/shared/src/index.ts:43-44`): `UPSTASH_REDIS_REST_URL`/`TOKEN` (old names) — api reads `UPSTASH_REDIS_URL`/`TOKEN` (new). The `REST` entries are dead. **MEDIUM**.
- **Dead `CORS_ORIGINS` (plural)** in shared schema (line 20) — api only reads `CORS_ORIGIN` (app.ts:49,63) and splits on commas; `CORS_ORIGINS` never read. **MEDIUM** (misleading duplicate config).
- `render.yaml` defines only `voeq-api` (web → Vercel) — correct split, not a gap. ✅
- `vercel.json` buildCommand chains shared+ui+web correctly. ✅
- `@voeq/shared` is real/used (envSchema, HealthResponseSchema, VOEQ_VERSION). ✅

---

## ROOT-CAUSE DEEP DIVE (second pass — corrected)
First pass flagged "6 dead admin stubs" as dead features. **Correction after tracing to root:**
- **`/api/stats` is LIVE and correct** (`apps/api/src/routes/stats.ts:6-16`, mounted `app.ts:161`) → returns real `institutions/categories/vendors/listings` counts. Web landing **never consumes it**; it hardcodes "10,000+ students". There is **no student count anywhere** (no Student model). Root cause: marketing copy hardcoded; live stats endpoint exists but unwired. Fix = wire `GET /api/stats` into hero/for-vendors copy, or drop the number.
- **Admin API routes are REAL** (`admin/campuses.ts:6-16` queries `prisma.campus.findMany`; same for featured/features/system/impersonate). So the 6 "dead" admin **frontend pages** are *incomplete*, not backend-dead. Backend exists; frontend pages are `<p>placeholder</p>`. Fix = build the 6 pages against existing API, OR remove their nav links until built. **Not** "drop tables."
- **`Request` table = TRUE ORPHAN** — no `requests.ts` route, no frontend page. Schema only.
- **`@voeq/ui` = TRUE DEAD package** — only in `.next` build artifacts + `package.json` workspace def; zero source imports.

## PRIORITIZED FIX PUNCH LIST (root-cause corrected)
1. **HIGH** — Landing "10,000+ students" (`for-vendors/page.tsx:67`, `LandingPage.tsx:405`): wire live `GET /api/stats` into copy, or remove the specific number (no student metric exists).
2. **HIGH** — Placeholder WhatsApp link (`public-group/layout.tsx:117` `WOeqPlaceholder`): make business contact number configurable (env/setting) or hardcode the real one; not a vendor number.
3. **HIGH** — 6 incomplete admin frontend pages (campuses/featured/features/impersonating/profile/system): build against existing admin API routes, OR remove their nav entries until built (don't expose fake surfaces).
4. **HIGH** — `Request` table: build the campus-request feature, or drop the table + migration.
5. **MEDIUM** — Remove dead `@voeq/ui` workspace package (nothing imports it) or populate it.
6. **MEDIUM** — Clean shared `envSchema`: drop stale `UPSTASH_REDIS_REST_*` (old names) + dead `CORS_ORIGINS` (api reads `CORS_ORIGIN` only).
7. **MEDIUM** — Wire `ImpersonationBanner` to real session, or remove.
8. **LOW** — `ListingPhoto` raw-SQL join (`search.service.ts:110`) → Prisma relation.
9. **LOW** — Dead tables if features abandoned: `AuthIdentity`/`VerificationToken`/`ListingCategory`/`WaitlistEntry`/`Account` (legacy NextAuth). Confirm before dropping.

## WHAT'S CLEAN (no action)
Backend route registration · rate-limit migration · email error handling · enum coverage · frontend auth gate logic · frontend routing (no dead links) · @voeq/shared · render/vercel config split.

---
NOTE: Subagent sweeps (4 dispatched) all timed out at 600s on open-ended "audit everything" briefs — the repo is large and they exhausted the window on file reads. This report was produced by direct targeted scans (fast, evidence-backed). Re-run any domain deeper on request.
