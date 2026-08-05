# Voeq Production Deployment Guide

This guide walks through deploying Voeq to production.

## Prerequisites

- [ ] Domain purchased (`voeq.ng`)
- [ ] Cloudflare account
- [ ] Vercel account
- [ ] Render account
- [ ] Neon account
- [ ] Cloudinary account
- [ ] Resend account (with verified domain)
- [ ] PostHog account
- [ ] Sentry account
- [ ] UptimeRobot account

## Deployment Order

1. **Domain & DNS** (see [domain.md](domain.md))
2. **Neon Database** (see [neon.md](neon.md))
3. **Cloudinary** (see [cloudinary.md](cloudinary.md))
4. **Resend** (see [resend.md](resend.md))
5. **PostHog** (see [posthog.md](posthog.md))
6. **Sentry** (see [sentry.md](sentry.md))
7. **Render Backend** (see [render.md](render.md))
8. **Vercel Frontend** (see [vercel.md](vercel.md))
9. **UptimeRobot** (see [uptimerobot.md](uptimerobot.md))
10. **Cloudflare** (see [cloudflare.md](cloudflare.md))

## Launch Checklist

See [../launch-checklist.md](../launch-checklist.md)

## Incident Response

See [../runbook.md](../runbook.md)
