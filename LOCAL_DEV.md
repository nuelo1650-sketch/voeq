# Local Development

## Email (OTP / magic-link / password reset)

In production, transactional email is sent via **Resend** (`RESEND_API_KEY`).
Locally you usually don't have Resend wired up, so spin up **Mailpit** — a
local SMTP sink with a web inbox — to actually receive OTPs and links.

```bash
docker compose up -d        # starts Mailpit
# SMTP:   localhost:1025
# Inbox:  http://localhost:8025
```

Then in `apps/api/.env` (or `.env.local`) set:

```bash
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
SMTP_SECURE=false
```

Behaviour (in `apps/api/src/services/email.service.ts`):

1. `RESEND_API_KEY` set  → Resend (production path).
2. `SMTP_HOST` set       → nodemailer → Mailpit (local dev). OTPs/magic-links
                            appear in the http://localhost:8025 inbox.
3. neither               → console fallback (`[DEV OTP] email -> code`) so local
                            runs still work without Docker.

## Running the apps

```bash
pnpm install
pnpm --filter @voeq/api dev      # API on :3000 (or configured PORT)
pnpm --filter @voeq/web dev      # web on :3001
```
