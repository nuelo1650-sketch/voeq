# Render Environment Variables Quick Reference

Copy these into your Render dashboard: **Service Settings → Environment**

## 🔴 REQUIRED (API won't start without these)

```bash
# Database
DATABASE_URL=postgresql://neondb_owner:npg_sj6RpoVrgQa4@ep-solitary-tree-azz5uk0p-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require

# Auth Secret (generate new one!)
AUTH_SECRET=<run: openssl rand -base64 32>

# Google OAuth (get from Google Cloud Console)
AUTH_GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
AUTH_GOOGLE_CLIENT_SECRET=your-secret

# Email (get from Resend.com)
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Cloudinary (get from Cloudinary dashboard)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-secret

# Sightengine (get from Sightengine.com)
SIGHTENGINE_USER=1234567890
SIGHTENGINE_SECRET=your-secret

# CORS (your frontend URL)
CORS_ORIGIN=https://yourdomain.vercel.app
```

## 🟡 RECOMMENDED (for full functionality)

```bash
# URLs
NEXTAUTH_URL=https://yourdomain.vercel.app
WEB_URL=https://yourdomain.vercel.app
NEXT_PUBLIC_API_URL=https://your-api.onrender.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.vercel.app

# Admin
ADMIN_EMAIL=admin@yourdomain.com
IMPERSONATION_SECRET=<run: openssl rand -base64 32>

# Direct DB Connection (for migrations)
DIRECT_URL=postgresql://neondb_owner:npg_sj6RpoVrgQa4@ep-solitary-tree-azz5uk0p.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

## 🟢 OPTIONAL (can add later)

```bash
# Error Tracking
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx

# Rate Limiting (Upstash)
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# Bot Protection (Cloudflare Turnstile)
TURNSTILE_SECRET_KEY=your-secret

# Logging
LOG_LEVEL=info
```

---

## Already Set in render.yaml (don't add these)

These are pre-configured in your `render.yaml`:
- ✅ `NODE_ENV=production`
- ✅ `PORT=4000`
- ✅ `AUTH_TRUST_HOST=true`
- ✅ `LOG_LEVEL=info`

---

## How to Generate Secrets

```bash
# AUTH_SECRET (32+ characters)
openssl rand -base64 32

# IMPERSONATION_SECRET (32+ characters)
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Where to Get API Keys

| Service | URL | What You Need |
|---------|-----|---------------|
| **Neon** | https://console.neon.tech | Connection string (already have) |
| **Google OAuth** | https://console.cloud.google.com | Client ID & Secret |
| **Resend** | https://resend.com/api-keys | API Key |
| **Cloudinary** | https://console.cloudinary.com | Cloud name, API key, Secret |
| **Sightengine** | https://sightengine.com | User ID & Secret |
| **Upstash** | https://console.upstash.com | Redis URL & Token |
| **Sentry** | https://sentry.io | DSN |

---

## Setting Environment Variables in Render

1. Go to https://dashboard.render.com
2. Click your **voeq-api** service
3. Click **Environment** in left sidebar
4. Click **Add Environment Variable**
5. Paste key and value
6. Click **Save Changes**
7. Render will automatically redeploy

**Pro tip**: Use the "Add from .env" feature to paste multiple variables at once!

---

## Verification

After setting all variables, check the logs for:

```
✅ Environment variables loaded
✅ Database connection successful
✅ Server listening on port 4000
✅ Health check endpoint ready at /health
```

If you see ❌ errors about missing variables, add them and redeploy.
