# Domain Setup (`voeq.ng`)

## Purchase Domain

1. Visit [namecheap.com](https://namecheap.com) or [porkbun.com](https://porkbun.com)
2. Search for `voeq.ng`
3. Purchase (~$10-15/year for .ng domain)
4. Note the registrar's DNS settings

## Cloudflare Setup

1. Sign up at [cloudflare.com](https://cloudflare.com) (free plan)
2. Add site `voeq.ng`
3. Cloudflare will scan existing DNS records
4. Update nameservers at registrar to Cloudflare's nameservers
5. Wait for propagation (up to 24 hours)

## DNS Records

In Cloudflare DNS, add:

- `A` record: `@` → `76.76.21.21` (Vercel)
- `CNAME` record: `www` → `cname.vercel-dns.com`
- `CNAME` record: `api` → `<your-render-service>.onrender.com`

## SSL

- Cloudflare provides automatic SSL
- Vercel and Render also provide SSL
- Use "Full (Strict)" mode in Cloudflare
