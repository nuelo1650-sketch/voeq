# Render Backend Setup

## Create Web Service

1. Sign up at [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repo: `your-org/voeq`
4. Root directory: `apps/api`
5. Runtime: Node
6. Build command: `pnpm install --filter @voeq/api... && pnpm --filter @voeq/api build`
7. Start command: `pnpm --filter @voeq/api start`
8. Plan: Free (or Starter $7/mo for always-on)

## Environment Variables

Add all vars from `apps/api/.env.example` with production values.

## Custom Domain

1. Settings → Custom Domains
2. Add `api.voeq.ng`
3. Copy CNAME target
4. Add CNAME record in Cloudflare: `api` → `<render-cname>`

## Health Check

- Path: `/health`
- Interval: 30s

## Keep-Alive

- Add UptimeRobot monitor (see [uptimerobot.md](uptimerobot.md))
