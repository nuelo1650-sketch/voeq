# Voeq Launch Checklist

## Pre-Launch (1 week before)

### Infrastructure

- [ ] Domain `voeq.ng` purchased
- [ ] Cloudflare account created, DNS configured
- [ ] Neon production database created
- [ ] Cloudinary production account ready
- [ ] Resend domain verified
- [ ] PostHog project created
- [ ] Sentry projects created
- [ ] UptimeRobot monitors configured
- [ ] Vercel project created, domain connected
- [ ] Render web service created, domain connected

### Security

- [ ] All secrets in env (no secrets in code)
- [ ] `pnpm audit` shows no high vulnerabilities
- [ ] Sentry capturing test errors
- [ ] Upstash rate limiting active
- [ ] Turnstile on signup form
- [ ] Security headers active (CSP, HSTS, etc.)
- [ ] CORS locked to production origins
- [ ] Admin account exists in production DB

### Data

- [ ] Production database migrated
- [ ] Seed data loaded (100+ universities, 21 categories)
- [ ] Agreement v1 content loaded (`pnpm --filter @voeq/db agreements:update`)
- [ ] Admin account `owidavid2002@gmail.com` exists

### Monitoring

- [ ] UptimeRobot pinging every 5 min
- [ ] Sentry receiving test events
- [ ] PostHog tracking page views
- [ ] Render keep-alive working

### Performance

- [ ] Lighthouse score 95+ on `/`
- [ ] Lighthouse score 95+ on `/browse`
- [ ] Lighthouse score 95+ on `/l/[slug]`
- [ ] LCP < 2.0s on 4G
- [ ] CLS < 0.05
- [ ] Bundle size < 200KB initial

### Legal

- [ ] Privacy Policy published at `/privacy`
- [ ] Terms of Service published at `/terms`
- [ ] Vendor Agreement published at `/vendor-agreement`
- [ ] Cookies banner appears on first visit
- [ ] NDPR compliance reviewed

## Launch Day

- [ ] DNS propagated (check with `dig voeq.ng`)
- [ ] SSL certificate active (check with `https://voeq.ng`)
- [ ] All services up and responding
- [ ] Test signup flow (buyer)
- [ ] Test vendor onboarding (5 steps → go live)
- [ ] Test review submission
- [ ] Test WhatsApp click (with real vendor)
- [ ] Test report submission
- [ ] Test admin impersonation
- [ ] Test CSV export
- [ ] Mobile test (iPhone, Android)
- [ ] Accessibility test (screen reader, keyboard)

## Post-Launch (1 day after)

- [ ] Monitor Sentry for errors
- [ ] Monitor UptimeRobot uptime
- [ ] Monitor PostHog events
- [ ] Monitor Cloudinary credits
- [ ] Monitor Resend quota
- [ ] Monitor Neon compute hours
- [ ] Monitor Render uptime
- [ ] Check Lighthouse score (still 95+?)
- [ ] Check search rankings (Google Search Console)
- [ ] Respond to any user feedback
