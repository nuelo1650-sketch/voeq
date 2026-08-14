# VOEQ — Full Architectural Redesign

> Single source of truth for the auth/routing/identity rebuild.
> Status: **DESIGN — not yet approved. No code has been written against this doc.**
> Companion investigation notes: see "Open Investigations" (§14).

---

## 0. Stance (non-negotiables)

1. **Single source of truth for role** = `User.role` only. Delete `currentContext`.
2. **Central edge gate** (`middleware.ts`) decides auth/role; pages never self-gate with client `useEffect`.
3. **Atomic promotion** — Vendor row + role set in one transaction, idempotent.
4. **Graceful degradation by design** — a missing Vendor row is a `200 {hasVendor:false}`, never a 404 crash.
5. **Faithful local dev** — OTP reachable in-browser via Mailpit.
6. **Fail-closed edge** — bad JWT = unauthenticated, never "let through."
7. **Verify everything** — browser + curl matrix per role before any "done."

---

## 1. Identity & Role Model (root fix)

### Current (broken)
```
User {
  role:          buyer | vendor | admin | super_admin
  currentContext: buyer | vendor          // SECOND FIELD, write-only dead state
  vendor:         Vendor?
}
JWT payload = { sub, email, role }         // currentContext NOT in JWT
```
- `resolvePostAuthDestination` (the real routing brain) **never reads `currentContext`** — only `role` + `vendorStatus`.
- `currentContext` is written only at signup (`auth.service.ts:70,84`) and OAuth (`auth.ts:325`) and `/upgrade` (`vendor.ts:121`) — **three write sites, zero readers for routing.**
- Because the JWT carries `role` but not `currentContext`, the two can disagree after login.

### Target
```
User {
  role:          buyer | vendor | admin | super_admin     // ONLY role field
  // currentContext + UserContext enum: REMOVED
  vendor:         Vendor?
}
JWT payload = { sub, email, role, vendorStatus }   // vendorStatus added
```
- "Is this user a vendor?" = `role === 'vendor'` **AND** a `Vendor` row exists (`@unique userId`).
- A vendor can still browse/shop — shopper pages gate on *authenticated*, not *buyer role*. No context-switch UI needed; shopper chrome shows a "Sell on Voeq" CTA.
- Migration required → **requires DB approval before applying.**

---

## 2. EDGE GATE — `middleware.ts` (closes gaps #1, #2, #9)

Edge middleware using `jose` + `AUTH_SECRET`. Runs on every request **except** `/api/*` (API self-guards).

### Fail-closed (#9 — explicit)
- JWT decode throws (bad signature, malformed cookie, missing secret, edge hiccup) → treat as **unauthenticated** → redirect `/signin`. **Never fail open.**
- No cookie → unauthenticated → apply public/protected rules below.
- Decode success but `role` missing/invalid → unauthenticated.

### Route table
| Path | Rule |
|---|---|
| `/admin`, `/admin/*` | session + `role∈{admin,super_admin}` else → `/signin` (wrong role after signin → `/home`) |
| `/vendor`, `/vendor/*` | session + `role∈{vendor,admin,super_admin}` else → `/signin` (wrong role → `/become-vendor`) |
| `/home`, `/buyer-dashboard`, `/wishlist`, `/following`, `/messages`, `/profile`, `/profile/upgrade`, `/settings`, `/select-campus`, `/become-vendor` | session (any role) else → `/signin` |
| `/signin`, `/signup`, `/forgot-password`, `/reset-password` | **if valid session → redirect to role destination (#1):** vendor→`/vendor`, admin→`/admin`, buyer→`/home` |
| `/verify-otp` | **requires `voeq_pending` cookie OR valid session (#2)**; else → `/signup` |
| `/`, `/browse`, `/search`, `/v/[slug]`, `/l/[slug]`, `/for-vendors`, `/about`, `/careers`, `/press`, `/media`, `/privacy`, `/terms`, `/cookies`, `/vendor-agreement`, `/events`, `/housing`, `/waybill` | public |

### Defense-in-depth (kept)
- `admin/layout.tsx` → `requireSuperUserAdmin()` (server) — sound, keep.
- `vendor/layout.tsx` → role check (role only) — keep, but never gate on `/me` success.
- `(main)/layout.tsx` → **demoted to pure chrome** (sidebar, AgreementModal, CampusSelectModal). No auth decision.

### Verification
- Anon hits `/home` → 307 → `/signin`.
- Vendor hits `/signin` → 307 → `/vendor`.
- Admin hits `/signin` → 307 → `/admin`.
- Tampered JWT → 307 → `/signin` (fail-closed).

---

## 3. SIGNUP — actual page logic (emphasized; closes #2, #3)

### Page `/signup` (`(auth)/signup/page.tsx`, client)
- Buyer/Vendor **toggle** (`intent` state), **now honors `?intent=vendor`** via Suspense-wrapped `useSearchParams` (fixed: previously defaulted to buyer and ignored the query).
- Submit → `POST /api/auth/signup/password` → OTP delivered → navigate `/verify-otp?email&intent`.
- Google button → `signInWithGoogle(intent)` → API `/api/auth/google?intent`.

### API `/signup/password` — strengthened
- Create user: `role = intent`, **no `currentContext`**.
- **Issue short-lived `pendingToken` (NOT the session JWT)**; set httpOnly `voeq_pending` cookie (TTL 5 min).
- Store OTP; deliver via Mailpit (local) / Resend (prod). **Never log OTP in prod.**
- **Composite rate limit = per-email + per-IP** (replaces IP-only, see §13).
- **Brute-force lockout:** N failed verify attempts on an email → temporary cooldown.

### Page `/verify-otp` — gated (#2)
- If no `voeq_pending` cookie / valid session → redirect `/signup`.
- Submit → `POST /api/auth/verify-otp` with `{ email, otp, pendingToken }`. **`pendingToken` required** → closes email-bombing / account-enumeration (you cannot reach verify for an arbitrary email without the pending signup it was issued for).
- On success → session JWT (includes `vendorStatus`); `resolvePostAuthDestination` routes.

### `/resend-otp`
- Requires `pendingToken` (#2) + composite rate limit (#3).

---

## 4. SIGNIN — actual page logic (emphasized; closes #1)

### Page `/signin` (`(auth)/signin/page.tsx`)
- Email/password → `POST /api/auth/signin/password` via proxy (`/api-internal`) which passes `Set-Cookie` through to `voeq.ng`. (Google uses token-in-query because the Google redirect breaks the proxy chain — see §12.)
- **"List your business" link (AuthShell) → `/signup?intent=vendor`** (fixed from `/become-vendor`, which bounced logged-out users to `/signin` = loop).
- After success → `resolvePostAuthDestination`: admin→`/admin`; vendor→live?`/vendor`:`resumeStep`; buyer→`/home`.
- **Already-authed visitors are bounced by the edge gate (§2), not by the page.**

### `resolvePostAuthDestination` (kept, role-only)
```
admin|super_admin → /admin
vendor → vendorStatus==='live' ? /vendor : resumeStep(progress)
else → /home
```

---

## 5. "LIST YOUR BUSINESS" — actual CTA logic (emphasized; closes loop)

- **Landing header / mobile menu / vendor section / bottom CTA → `/signup?intent=vendor`** (fixed; was `/become-vendor` → loop for anon).
- **`/buyer-dashboard` "Sell on Voeq" → `/become-vendor`** (correct for an authed shopper; becomes the `/upgrade` trigger).
- **`/for-vendors`** = marketing page linking to `/signup`.
- All CTAs route new vendors through **signup (intent=vendor) → OTP → onboarding**, never through the auth-gated `/become-vendor` for anonymous visitors.

---

## 6. PROMOTION (buyer → vendor) — atomic (closes #5, #7, #8)

### `POST /api/vendors/upgrade` — idempotent + atomic
Inside `prisma.$transaction`:
1. `prisma.vendor.upsert({ where:{userId}, create:{...incomplete}, update:{} })` → **no duplicate-row 500 on double-click/race** (today: unhandled unique-constraint 500, see §14).
2. `user.update({ role:'vendor' })` (no `currentContext`).
- If already vendor → returns existing row, clean no-op.

### OAuth path (#8 — explicitly traced)
- `auth.ts:325` writes `currentContext` today → **remove**.
- OAuth vendor signup creates the `Vendor` row **atomically at callback** (upsert, same as `/upgrade`); sets `role` only.
- Dest logic already role-based (mirrors `resolvePostAuthDestination`); remove `currentContext` write.

### Flow
`/become-vendor` "Get started" → `/upgrade` → `/vendor/onboarding/step-1` → steps progress → `live` → `/vendor` dashboard (business name, status badge, setup % bar, 4 stat cards: Views / WhatsApp clicks / Active listings / Reviews, listings list, quick actions).

---

## 7. ONBOARDING SEQUENCING (closes #4, #5, #6)

- **Resume step (#5):** `resolvePostAuthDestination` (and OAuth dest) sends incomplete vendors to `resumeStep(vendor.onboardingProgress)` — **not always step-1**. Complete 1–3, log out, return → lands on step 4.
- **Per-step guard (#4):** each `step-N` page, after `requireVendor()`, reads `vendor.onboardingProgress`; if requested step > reachable step → redirect to reachable step. No jumping to step-5 with missing prerequisites.
- **Merge safety (#6 — verified):** `PATCH /api/vendors/me` is create-or-**merge** (`...rest` of provided fields only). Resuming step-1 does **not** overwrite steps 2–5. **All onboarding PATCHes must follow this partial-merge pattern; verify each at build.**

---

## 8. VENDOR SURFACE RESILIENCE (kills crash/loop)

- `GET /api/vendors/me`: for an **authenticated vendor-role** user with no row → return `{ hasVendor:false }` (HTTP 200), not 404. 404 only for truly unauthenticated.
- `vendor/page.tsx`: handles `hasVendor:false` → "Continue setup" card (already in working tree). Never throws.
- `vendor/layout.tsx`: gates on `role` only.
- The open `/me` 404 mystery becomes a **non-issue by design** — but still diagnosed separately (§14) so we don't hide a data bug.

---

## 9. OPEN INVESTIGATION — `/me` 404 mystery (Phase 0)

**Symptom (verified):** seeded vendor row provably exists (`/upgrade` returns it with correct `userId`), yet `/api/vendors/me` 404s for that `userId`; `/users/me` works on the same session.

**Plan (investigation only):**
1. Deploy diagnostic `/debug-me` → read `vendorFindUnique`, `vendorRaw`, `totalVendors`, `userId` from live DB.
2. Row present but `findUnique` null → Prisma query/type bug → root-fix query.
3. Row absent → two-DB / seed-vs-prod mismatch → fix seed/connection.
Resolved before trusting promotion.

---

## 10. LOCAL DEV (faithful)

- `email.service.ts`: non-prod → Mailpit SMTP (`localhost:1025`) + `console.log` OTP. Resend prod-only.
- `docker-compose.yml`: Mailpit (UI `:8025`, SMTP `:1025`).
- `.env.local.example`: `DEV_OTP_SINK=mailpit`, `NEXT_PUBLIC_API_URL=http://localhost:4000`, `WEB_URL=http://localhost:3000`, `AUTH_SECRET`.
- Click full flow in-browser; read OTP from Mailpit.

---

## 11. SESSION / REVOCATION LAYER (NEW GAP — not in original 9)

Current: login issues a **stateless JWT** and **never writes a `Session` row**. So:
- `revokeAllUserSessions()` deletes `prisma.session` rows that don't exist for JWT logins → **"logout everywhere" is a no-op.**
- No token revocation, no refresh/rotation, no server-side expiry enforcement.

Target:
- Introduce a `Session` table (`id`, `userId`, `tokenHash`, `expiresAt`, `revokedAt`, `ip`, `userAgent`).
- On login/OAuth/verify: create a Session row; JWT `jti` references it.
- Middleware/API `requireAuth` checks: JWT valid **AND** session not revoked/expired (for non-public paths).
- `signout` / `logout-all` revoke the row(s) → instantly invalid.
- Optional: rotating refresh tokens for long-lived sessions (defer if scope creep).

This is a **Phase 1.5** addition — required for "logout everywhere" and real revocation to function.

---

## 12. `/auth-callback` OPEN-REDIRECT HARDENING (NEW GAP)

`apps/web/src/app/api/auth/google/callback/route.ts` sets the post-login destination from the query `dest` param **without validation**. A malicious `?dest=//evil.com` could redirect off-site.

Target: pin `dest` to an **internal path whitelist** (same-origin, no protocol-relative, no `//`). Reuse the §2 route classification.

---

## 13. RATE LIMITING REDESIGN (closes #3 — deeper than originally scoped)

Current `rate-limit.ts`: **IP-only, in-memory, per-process.** On Render multi-instance, state isn't shared → limits don't hold. No per-email key, no brute-force lockout.

Target:
- **Composite key** = `ip + email` for signup/otp/resend/verify.
- **Shared store** (Redis or Upstash) so limits hold across instances.
- **Brute-force lockout**: track failed OTP verifies per email; after N, cooldown window.
- Apply to: `/signup/password`, `/verify-otp`, `/resend-otp`, `/signin/password`, `/magic-link*`, `/password-reset/*`.

---

## 14. FULL PHASE PLAN (gaps folded in)

- **Phase 0 — Investigate:** diagnose `/me` 404 (§9); reset temporary band-aids (vendor layout, dashboard `.catch`, LandingPage CTA, signup intent) to a clean trunk.
- **Phase 1 — Schema:** drop `currentContext`; add `vendorStatus` to JWT; migration (DB approval).
- **Phase 1.5 — Sessions:** `Session` table + create-on-login + revoke checks (§11).
- **Phase 2 (incl. #1, #2, #3, #9, §12, §13 edge parts):** `middleware.ts` edge gate; auth-page bounce; `voeq_pending` + `pendingToken`; composite shared rate limit + brute-force lockout; fail-closed; `/auth-callback` dest whitelist.
- **Phase 3 (incl. #5, #6, #7, #8):** atomic idempotent `/upgrade`; OAuth row creation; step-1 merge verified; signup returns `pendingToken`.
- **Phase 4 (incl. #4, #5):** onboarding per-step guard + resume-step routing; `/vendors/me` returns `hasVendor:false`.
- **Phase 5 — Local dev:** Mailpit + compose + OTP sink.
- **Phase 6 — Verify:** browser + curl matrix (anon / buyer / vendor-incomplete / vendor-live / admin × all routes); DB check confirms Vendor row after promotion; OTP readable in Mailpit; logout-everywhere actually revokes.

---

## 15. VERIFICATION CRITERIA (acceptance)

- Every role × every protected route → correct allow/redirect (matrix).
- Promotion end-to-end local **and** prod (buyer→upgrade→onboarding→live→dashboard shows).
- `/verify-otp` unreachable by bare `?email=` URL (needs `voeq_pending`/`pendingToken`).
- Double-click `/upgrade` → clean idempotent (no 500).
- OAuth vendor gets Vendor row atomically; no `currentContext` anywhere (grep-clean).
- Onboarding resume lands on correct step; step-1 merge cannot destroy later data.
- Middleware fails closed on bad JWT.
- OTP: composite throttle + brute-force lockout present and shared across instances.
- `/auth-callback` `dest` cannot redirect off-site.
- Logout-everywhere actually revokes the session (Session row deleted, JWT rejected).

---

## 16. WHAT IS OUT OF SCOPE (deliberately)

- `/events`, `/housing`, `/waybill` — public "coming soon" stubs (v2 / December). Untouched.
- Visual/polish redesign of existing pages — keep current look; only gate/logic changes.
- Rewriting the 90+ page internals — preserve; only guards + promotion + OTP touched.
- PostHog/Sentry wiring — separate track, not part of this redesign.
- Campus-gating consistency (`select-campus`, CampusSelectModal double-prompt) — adjacent; flagged but not in this pass unless it blocks onboarding.

---

## 17. OPEN QUESTIONS FOR APPROVAL

1. **Scope of Sessions (§11):** full `Session` table + revocation now, or defer refresh tokens? (Recommend: Session table + revoke now; refresh tokens deferred.)
2. **Rate-limit store (§13):** Redis vs Upstash (serverless-friendly)? (Recommend Upstash for Vercel/Render.)
3. **DB migration approval** for `currentContext` removal + `Session` table.
4. Where to keep this doc — `docs/architecture-redesign.md` (repo) or elsewhere.

---

*End of design. No code written. Approve (and answer §17) to begin Phase 0.*
