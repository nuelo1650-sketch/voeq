# Phase 6 — Verification Matrix

Role × route gate assertions. Run against an environment by exporting `BASE`
(web origin) and a signed-in cookie jar per role. Anything not ✅ is a regression.

## Roles
| key | who | cookie |
|-----|-----|--------|
| anon | no session | none |
| buyer | verified buyer, no Vendor row | `buyer.txt` |
| vendor-inc | vendor, status != live | `vendor_inc.txt` |
| vendor-live | vendor, status = live | `vendor_live.txt` |
| admin | admin / super_admin | `admin.txt` |

## Protected prefixes (middleware PROTECTED_PREFIXES)
/home /buyer-dashboard /wishlist /following /messages /profile /settings
/select-campus /become-vendor /vendor /admin

## Expected outcomes
| route \ role | anon | buyer | vendor-inc | vendor-live | admin |
|--------------|------|-------|-----------|------------|-------|
| /signin (auth page) | 200 | 307→/home | 307→/vendor/onboarding/step-1 | 307→/vendor | 307→/admin |
| /signup (auth page) | 200 | 307→/home | 307→/vendor/onboarding/step-1 | 307→/vendor | 307→/admin |
| /home | 307→/signin | 200 | 200 | 200 | 200 |
| /vendor | 307→/signin | 307→/become-vendor | 307→/vendor/onboarding/step-1 | 200 | 200 (if admin) |
| /admin | 307→/signin | 307→/home | 307→/home | 307→/home | 200 |
| /verify-otp (bare) | 307→/signup | 200 | 200 | 200 | 200 |
| /verify-otp?pendingToken=valid | 200 | 200 | 200 | 200 | 200 |

## Cross-cutting checks (run once)
1. **Promotion**: buyer → `/upgrade` → 200; DB `Vendor` row exists (single, idempotent on 2nd call).
2. **OTP sink**: signup → OTP lands in Mailpit (http://localhost:8025) when `SMTP_HOST` set, else `[DEV OTP]` console line.
3. **Logout-everywhere**: signin → capture JWT; `logout-all` → `revokedSessions>=1`; reused JWT → 401 on any `requireAuth` route.
4. **§12 open-redirect**: `?dest=//evil.com` and `?dest=https://evil.com` on `/api/auth/google/callback` → 307 to `BASE/home` (never off-site).

## How to run (curl)
```bash
export BASE=https://voeq.ng
# anon
curl -s -o /dev/null -w "anon /home=%{http_code}\n" $BASE/home          # 307
# authed (repeat per role jar)
curl -s -o /dev/null -w "vendor-live /vendor=%{http_code}\n" -b vendor_live.txt $BASE/vendor  # 200
curl -s -o /dev/null -w "buyer /vendor=%{http_code}\n" -b buyer.txt $BASE/vendor            # 307
```
