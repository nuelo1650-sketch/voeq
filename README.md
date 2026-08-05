# Voeq

> Find. Connect. Grow. A multi-university campus marketplace built for Nigerian students.

## Architecture

- **Frontend:** Next.js 14 (App Router) on Vercel — `apps/web`
- **Backend:** Node.js + Express on Render — `apps/api`
- **Database:** Neon Postgres via Prisma — `packages/db`
- **Shared:** Types, Zod schemas, configs — `packages/shared`, `packages/config`

## Prerequisites

- Node.js 20 (`nvm use`)
- pnpm 9 (`npm install -g pnpm`)
- Accounts: Vercel, Render, Neon, Resend, Cloudinary, Sightengine, Google Cloud (for OAuth), PostHog, Sentry, Upstash, UptimeRobot

## Setup

```bash
# Install dependencies
pnpm install

# Copy env templates and fill in values
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
# (fill in values for each)

# Run both apps in dev
pnpm dev
```

Frontend runs on `http://localhost:3000`
Backend runs on `http://localhost:4000`

## Scripts

```bash
pnpm dev          # Run all apps
pnpm build        # Build all apps
pnpm typecheck    # Type check all apps
pnpm lint         # Lint all apps
pnpm clean        # Clean all builds + node_modules
```

## UptimeRobot Setup (Keep Render Awake)

Render free tier sleeps after 15 min of inactivity. To keep the API responsive:

1. Sign up at [UptimeRobot](https://uptimerobot.com) (free tier = 50 monitors)
2. Add a new monitor:
   - **Monitor Type:** HTTP(s)
   - **Friendly Name:** Voeq API Health
   - **URL:** `https://<your-render-url>.onrender.com/health`
   - **Monitoring Interval:** 5 minutes
3. Save. Render will stay awake 24/7 as long as the monitor pings it.

## Neon Postgres Setup

1. Sign up at [neon.tech](https://neon.tech) (free tier)
2. Create a new project:
   - **Name:** `voeq`
   - **Region:** `us-east-1` (AWS US East — lowest latency to Render Oregon; Neon has no Africa region yet)
   - **Postgres version:** 16 (default)
3. Copy the **pooled connection string** (looks like `postgresql://user:password@ep-xxx-pooler.us-east-1.aws.neon.tech/voeq?sslmode=require`)
4. Set it as `DATABASE_URL` in both `apps/web/.env.local` and `apps/api/.env`
5. Run migrations from the monorepo root:
   ```bash
   pnpm --filter @voeq/db prisma migrate dev
   pnpm --filter @voeq/db prisma db seed
   ```

### Neon Branching (for previews)
- Every Vercel preview deployment gets a Neon branch automatically (configure in Vercel integration)
- Branch name = Vercel deployment ID
- Preview branch auto-deleted after 7 days inactivity

## Phases

- **Phase 1 (current):** Discovery only — WhatsApp connect, no payments
- **Phase 2 (Jan 2027):** Paystack payments, escrow, subscriptions

## License

Proprietary — © Voeq Limited
