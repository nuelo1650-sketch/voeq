# Resend Email Setup

## Create Account

1. Sign up at [resend.com](https://resend.com)
2. Verify domain `voeq.ng`
3. Add DNS records to Cloudflare (Resend provides these)

## Sender Addresses

- General: `noreply@voeq.ng`
- Support: `hello@voeq.ng`
- Privacy: `privacy@voeq.ng`
- Vendor: `vendors@voeq.ng`
- Admin: `admin@voeq.ng`

## Environment Variables

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL` (use `noreply@voeq.ng`)

## Free Tier

- 3,000 emails/month
- 100 emails/day
- Monitor in Resend dashboard
