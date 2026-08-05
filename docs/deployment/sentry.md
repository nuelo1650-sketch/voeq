# Sentry Setup

## Create Projects

1. Sign up at [sentry.io](https://sentry.io)
2. Create project: `voeq-web` (Next.js)
3. Create project: `voeq-api` (Node.js)
4. Copy DSN for each

## Environment Variables

- `NEXT_PUBLIC_SENTRY_DSN` (web)
- `SENTRY_DSN` (api)
- `SENTRY_AUTH_TOKEN` (for source map upload)

## Source Maps

- Auto-uploaded via Vercel/Render integration
- Verify in Sentry → Settings → Source Maps

## Alert Rules

- Email when error rate > 10/min
- Slack integration (optional)
