# Voeq Flow Audit — Page by Page

(Method: read source, compare to intended behavior, verify live only where possible.)

---

## YOUR 21-BUG LIST — VERIFIED AGAINST CURRENT SOURCE

Legend: ✅ CONFIRMED (real bug, fix needed) | 🔁 STALE/ALREADY-FIXED (code already does this) | ❓ NEEDS-LIVE-VERIFY (symptom real, root cause unconfirmed) | 🔶 PARTIAL

### 🔴 CRITICAL
- **#1 NEXT_PUBLIC_API_URL missing** → 🔶 DEPLOYMENT CONFIG. Code defaults to '' (api.ts:1). If unset in Vercel, ALL browser calls break. LIVE SITE WORKS → it IS set. **Action: confirm in Vercel dashboard.** Not a code bug. Verify before anything.
- **#2 Password signup ignores intent** → 🔶 YOUR ROOT CAUSE WRONG. Frontend DOES pass intent (SignUpForm:63 → signUpWithPassword accepts it). Backend `signUpWithPassword` (auth.service.ts:24+) sets `role: isVendorIntent ? 'vendor' : 'buyer'` for NEW users. **New vendor signup → role='vendor' correctly.** Bug only possible if intent isn't 'vendor' at call time. Likely already working OR a different cause. ❓ VERIFY LIVE: sign up as vendor via password, check role.
- **#3 Google loses intent** → 🔶 YOUR ROOT CAUSE WRONG. `signInWithGoogle(intent)` (auth-client.ts:72) DOES build `?intent=${intent}` and redirect. Backend reads intent → OAuth state → sets role (auth.ts:363). **Already implemented.** ❓ VERIFY LIVE: Google signup as vendor, check role. May already work.
- **#4 OTP doesn't send intent** → 🔶 DOWNSTREAM OF #2. `verifyOtp({email, otp})` (verify-otp.tsx:103) has no intent, BUT `resolvePostAuthDestination` is role-driven, and role is set at signup. If #2 works, #4 is moot. Sending intent in OTP is harmless but unnecessary. ❓ VERIFY after #2.

### 🟠 HIGH
- **#5 Step 1 data never loads on revisit** → 🔶 SYMPTOM REAL, ROOT CAUSE WRONG. step-1 uses `getMyVendor()` (server, needs API_URL — set live). `BusinessBasicsForm` DOES restore from `getDrafts()` on mount (line 32-41). Empty-on-revisit happens if **draft never saved** (DraftBanner save failing/overwritten) — see #16. Not an API_URL issue live. ❓ VERIFY: fill step-1, go to step-2, back to step-1.
- **#6 Step 2 incomplete initial load** → 🔶 PARTIAL. `ContactLocationForm` effect (line 56-81) DOES set institutionId (from getMyVendor) + all social fields (line 68-73). Only gap: if `getMyVendor()` returns null (API_URL unset) nothing loads. Live it's set. ❓ VERIFY LIVE.
- **#7 Operating hours not integrated** → ✅ CONFIRMED GAP. Hours editor exists, not in onboarding flow. Real missing feature.
- **#8 Reset-password hardcoded /home** → 🔁 STALE/ALREADY-FIXED. `reset-password/page.tsx:63` uses `resolvePostAuthDestination(result.user)`. Already correct.
- **#9 OTP email editable** → ✅ CONFIRMED (verify-otp.tsx:179-188, onChange present). Real UX bug.
- **#10 Progress NaN** → 🔶 PARTIAL. `onboarding/page.tsx:17` guards NaN→0. Edge: progress>100 → step-6 (doesn't exist). Minor.

### 🟡 MEDIUM/LOW
- **#11 Step 5 no edit links** → ❓ VERIFY (haven't read ReviewAndGoLive yet). Plausible.
- **#12 Step 3 no skip** → 🔁 STALE/ALREADY-FIXED. `ProfilePhotoUpload.tsx:47-49` has `handleSkip` → step-4. Skip exists.
- **#13 WhatsApp regex generic** → 🔶 YOUR QUOTE WRONG. Code is `/^\+234[789]\d{9}$/` (ContactLocationForm:18) — already Nigerian. STALE.
- **#14 Institution no "not found"** → 🔁 STALE. Modal HAS "Can't find your institution? Request to add it" (ContactLocationForm:220-228). Exists.
- **#15 Agreement version silent fail** → ✅ CONFIRMED MINOR (SignUpForm:36). Low impact.
- **#16 Draft doesn't restore** → 🔶 PARTIAL. `BusinessBasicsForm` DOES restore drafts (line 32-41). But other steps? And if draft save overwrites with empty (getMyVendor null), restore shows empty. Mixed. ❓ VERIFY all steps.
- **#17 Listing photo no reorder** → ❓ VERIFY (FirstListingForm has movePhoto buttons line 119-131! So reorder EXISTS). STALE.
- **#18 OTP race / location.href** → ✅ CONFIRMED MINOR (uses setTimeout + location.href). Low.
- **#19 Custom category no validation** → ❓ VERIFY. Plausible.
- **#20 Auth callback no spinner** → ✅ CONFIRMED TRIVIAL.
- **#21 Inconsistent redirect methods** → ✅ CONFIRMED TRIVIAL.

---

## CORRECTED PRIORITY (based on VERIFIED root causes, not stale list)

**PHASE 0 — Verify deployment config**
- Confirm `NEXT_PUBLIC_API_URL` set in Vercel (likely yes, since live works). This invalidates #1 as a live bug and most "data doesn't load" claims as API_URL issues.

**PHASE 1 — Verify the INTENT bugs live (your #2/#3/#4)**
- These may ALREADY WORK in current code. Do NOT edit yet. Live-test: password vendor signup → role? Google vendor signup → role? If they work, your list is fully stale for these and we close them.

**PHASE 2 — Confirmed real bugs to fix**
- #7 Operating hours not in flow (missing feature)
- #9 OTP email editable (read-only)
- #5/#6/#16 Draft persistence (verify which steps actually lose data; fix the real cause — likely draft save overwrite when getMyVendor null, or DraftBanner loop)
- #15, #18, #20, #21 (low, batch)

**PHASE 3 — Verify-then-fix**
- #10 progress>100 edge
- #11 step-5 edit links
- #19 category validation

---

## MY OWN FINDINGS (from audit pass 1)
A. No forced campus selection in auth flow → users land campus-less. STRUCTURAL.
B. Google skips OTP by design (product decision).
C. "Saving draft" loop on become-vendor — needs /vendor + become-vendor audit.
D. Bottom nav during onboarding — guard added, user says still shows → layout audit.
E. `api()` client fetch has no `cache:'no-store'` → possible stale caching → slow/wrong pages.

## NEXT AUDIT PAGES
(main)/layout.tsx · server-api.ts · onboarding step-1..5 · /vendor · CampusSelectModal · ReviewAndGoLive
