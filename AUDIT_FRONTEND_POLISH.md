# VOEQ — Frontend Polish Audit + Fix Plan

Date: 2026-08-15. Scope: visual/UX/responsive polish of `apps/web` (65 pages, 182 components). This is a SEPARATE sweep from the defect/rot audit (`AUDIT_ROOT_FINDINGS.md`). Read/scan only — no code changed yet.

## FINDINGS (evidence-backed)

### F1 — DARK MODE BROKEN (~70% of tokens) 🔴 CRITICAL POLISH
- `tailwind.config.ts:10` → `darkMode: 'class'` is ON. Auth pages use `dark:` pairs correctly (e.g. `forgot-password/page.tsx:80-118`).
- But repo-wide: **2,070 light-only token classes** (`text-cream-100`, `bg-forest-800`, etc.) vs **884 paired** `dark:` tokens. Ratio ~7:3 unpaired.
- Worst offenders (unpaired / paired):
  - `components/landing/LandingPage.tsx` — **178 / 63**
  - `app/(main)/vendor/page.tsx` — 65 / 29
  - `app/admin/press/PressAdminClient.tsx` — 57 / 27
  - `app/(main)/vendor/analytics/page.tsx` — 44 / 22
  - `app/(main)/profile/page.tsx` — 44 / 22
  - `app/(public-group)/about/page.tsx` — 42 / 18
  - `components/home/HomeWizard.tsx` — 38 / 15
  - `components/vendor/FirstListingForm.tsx` — 35 / 12
  - `app/(public-group)/layout.tsx` — 34 / 6
  - `app/(main)/buyer-dashboard/page.tsx` — 33 / 13
  - `app/(auth)/verify-otp/page.tsx` — 31 / 13
  - `components/vendor/ContactLocationForm.tsx` — 30 / 13
  - `app/(public-group)/{press,media,for-vendors}/page.tsx` — 28 each
  - `app/(main)/browse/BrowseClient.tsx` — 28 / 13
  - `components/ui/Button.tsx` — 26 / 6  ← **core component, affects everything**
- Root cause: tokens applied without `dark:` counterparts → in dark mode these elements keep light colors (e.g. `text-cream-100` = near-white on light bg = invisible; `bg-forest-800` = dark on dark = invisible). The app supports dark mode but most of it wasn't themed.
- Fix: add `dark:` pairs to every unpaired forest/cream token. Highest leverage = `Button.tsx` + `LandingPage.tsx` first, then pages.

### F2 — WEAK LOADING / EMPTY / ERROR STATES 🟠 HIGH
- 65 pages; only **3** reference `isLoading`, only **9 files** have any skeleton/spinner.
- 31 files have *some* empty-state text, but data-heavy pages (browse, vendor listings, search, notifications) likely show blank flashes or unhandled empty arrays.
- Fix: add `isLoading` skeletons + empty states to data-fetching pages (browse, vendor/listings, search, buyer-dashboard, notifications, wishlist, following).

### F3 — RESPONSIVE: FIXED WIDTHS + NON-BREAKPOINT GRIDS 🟠 MEDIUM
- 5 hardcoded px widths (`w-[Npx]`).
- Several `grid-cols-2` WITHOUT `sm:`/`md:` (`signup/page.tsx:56`, `LandingPage.tsx:420`, `FirstListingForm.tsx:211`, `ListingForm.tsx:118`) → cramped on mobile.
- Fix: convert to `grid-cols-1 sm:grid-cols-2` (or `md:`), replace fixed px with responsive/`max-w`.

### F4 — MOBILE NAV COVERAGE 🟡 MEDIUM (verify)
- `AdminMobileNav.tsx` exists. Need to confirm main (buyer/vendor) + public nav have mobile hamburger/sheet. (Auth pages assumed ok.) Will verify during fix.

### F5 — DEAD/CONFUSING HANDLERS 🟡 LOW (spot-checked)
- No obvious dead `<button>` without handler found in spot-check; full sweep of 182 components deferred (would need per-file read). Lower risk than F1-F3.

## WHAT IS CLEAN
- Auth pages (`/signin`, `/forgot-password`, `/reset-password`, `/verify-otp`) — dark mode paired correctly, have spinners/error boxes.
- `darkMode:'class'` config present (dark mode is a supported feature, just unfinished).

## FIX PLAN (phase-gated, verify live after each)
1. **PHASE A — Dark mode (F1)** — add `dark:` token pairs app-wide, starting with `Button.tsx` (core) + `LandingPage.tsx`, then vendor/admin/public/browse pages. Verify in browser (light + dark toggle) live.
2. **PHASE B — Loading/empty/error states (F2)** — skeleton + empty states on data pages. Verify live.
3. **PHASE C — Responsive (F3)** — breakpoint grids + remove fixed px. Verify mobile viewport live.
4. **PHASE D — Mobile nav (F4)** — confirm/fix hamburger on main+public nav. Verify mobile live.
5. **PHASE E — Dead handlers (F5)** — per-component sweep if time; report only.

## EXECUTION NOTE
- This plan runs **autonomously after your sign-off** (you sleep). Each phase: fix → `pnpm --filter @voeq/web build` + typecheck → deploy to Vercel (git push auto-deploy) → verify live in browser (light+dark, mobile) → report.
- I will NOT skip verification. I will report what passed/failed when you wake.
- Scope is frontend polish only; no backend/auth changes (those are in `AUDIT_ROOT_FINDINGS.md`, separate sign-off).

## SIGN-OFF
[ ] Approve autonomous execution of Phases A–E
[ ] Approve Phases A–B only (stop after dark mode + states)
[ ] Adjust scope first (tell me)
