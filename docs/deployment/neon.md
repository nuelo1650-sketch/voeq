# Neon Database Setup

## Create Project

1. Sign up at [neon.tech](https://neon.tech)
2. Create new project: `voeq-production`
3. Region: `us-east-1` (AWS US East)
4. Postgres version: 16
5. Branching: Enabled

## Connection Strings

- **Pooled** (use for app runtime): `postgresql://user:pass@ep-xxx-pooler.us-east-1.aws.neon.tech/voeq?sslmode=require`
- **Direct** (use for migrations): `postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/voeq?sslmode=require`

## Production Settings

- Compute: Auto-scaling (0.25 to 4 CU)
- Storage: 10 GB (scales automatically)
- Backups: 7-day retention (free tier)

## Run Migrations

```bash
pnpm --filter @voeq/db prisma migrate deploy
```

## Seed Production

```bash
pnpm --filter @voeq/db agreements:update
```
