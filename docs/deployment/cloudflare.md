# Cloudflare Setup

## Add Site

1. Add `voeq.ng` to Cloudflare
2. Plan: Free
3. Update nameservers at registrar

## SSL/TLS

- Mode: Full (Strict)
- Always Use HTTPS: On
- Minimum TLS Version: 1.2

## Security

- Security Level: Medium
- Bot Fight Mode: On
- Challenge Passage: 30 minutes

## Turnstile

1. Cloudflare Dashboard → Turnstile
2. Add widget: `voeq`
3. Copy Site Key and Secret Key
4. Add to env vars

## Caching

- Browser Cache TTL: Respect Existing Headers
- Cloudflare Cache: Standard

## Page Rules

- `voeq.ng/api/*` → Cache Level: Bypass
- `voeq.ng/_next/*` → Cache Level: Cache Everything, Edge TTL: 1 year
- `voeq.ng/admin*` → Cache Level: Bypass, Security Level: High
