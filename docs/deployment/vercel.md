# Vercel Frontend Setup

## Import Project

1. Sign up at [vercel.com](https://vercel.com)
2. New Project → Import `your-org/voeq`
3. Root directory: `apps/web`
4. Framework: Next.js (auto-detected)
5. Build command: `next build` (default)
6. Output: `.next` (default)

## Environment Variables

Add all vars from `apps/web/.env.example` with production values.

## Custom Domain

1. Settings → Domains
2. Add `voeq.ng` and `www.voeq.ng`
3. Vercel will provide DNS records
4. Add to Cloudflare:
   - `A` record: `@` → `76.76.21.21`
   - `CNAME` record: `www` → `cname.vercel-dns.com`

## Branching

- Production: `main` branch
- Preview: Every PR gets a preview deployment + Neon branch
