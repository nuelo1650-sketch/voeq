# Render Deployment Guide for Voeq API

## What I Fixed

The build was failing because:
1. ❌ `turbo` was in `devDependencies` but needed in production
2. ❌ Build command wasn't navigating to monorepo root properly
3. ❌ Missing required environment variables

**Fixed:**
✅ Moved `turbo` to `dependencies` in root `package.json`
✅ Updated `render.yaml` with correct build commands
✅ Added all required environment variables to `render.yaml`

---

## Quick Deploy Steps

### 1. Trigger Redeploy on Render

Your repository is already connected to Render. The latest commit should trigger an automatic deployment. If not:

1. Go to https://dashboard.render.com
2. Find your **voeq-api** service
3. Click **Manual Deploy** → **Deploy latest commit**

### 2. Set Environment Variables

Go to your service settings and add these **required** variables:

```bash
# Database (Neon)
DATABASE_URL=postgresql://neondb_owner:npg_sj6RpoVrgQa4@ep-solitary-tree-azz5uk0p-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
DIRECT_URL=postgresql://neondb_owner:npg_sj6RpoVrgQa4@ep-solitary-tree-azz5uk0p.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require

# Authentication
AUTH_SECRET=<generate with: openssl rand -base64 32>
AUTH_GOOGLE_CLIENT_ID=<your-google-client-id>
AUTH_GOOGLE_CLIENT_SECRET=<your-google-client-secret>
AUTH_TRUST_HOST=true
NEXTAUTH_URL=https://your-frontend-url.com
WEB_URL=https://your-frontend-url.com

# Email (Resend)
RESEND_API_KEY=<your-resend-api-key>
RESEND_FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>

# Sightengine
SIGHTENGINE_USER=<your-user-id>
SIGHTENGINE_SECRET=<your-secret>

# Site URLs
CORS_ORIGIN=https://your-frontend-url.com
NEXT_PUBLIC_API_URL=https://your-api-url.onrender.com
NEXT_PUBLIC_SITE_URL=https://your-frontend-url.com
```

### 3. Monitor the Build

Watch the build logs in Render dashboard. You should see:

```
✅ Cloning repository
✅ Installing dependencies with pnpm
✅ Generating Prisma client
✅ Building API with TypeScript
✅ Starting server
✅ Health check passed at /health
```

---

## Understanding the Build Process

The updated `render.yaml` now:

1. **Navigates to monorepo root**: `cd ../..`
2. **Installs all dependencies**: `pnpm install --frozen-lockfile`
3. **Generates Prisma client**: `pnpm --filter @voeq/db prisma:generate`
4. **Builds API**: `pnpm --filter @voeq/api build`
5. **Starts server**: `pnpm --filter @voeq/api start`

---

## Troubleshooting

### Build still fails with "turbo: not found"
- Clear build cache in Render dashboard
- Trigger a fresh deploy

### "Can't reach database server"
- Verify `DATABASE_URL` is set correctly
- Check Neon database is running
- Ensure IP allowlist includes Render IPs (or set to `0.0.0.0/0`)

### "Invalid environment variables"
- Check all required env vars are set in Render dashboard
- Ensure no missing quotes or special characters
- Generate `AUTH_SECRET`: `openssl rand -base64 32`

### Health check fails
- API server must respond to `/health` endpoint
- Check logs for startup errors
- Verify `PORT` is set to `4000` (or matches your config)

---

## Post-Deployment Checklist

Once deployed successfully:

- [ ] Test health endpoint: `https://your-api.onrender.com/health`
- [ ] Test authentication flow
- [ ] Verify database connection
- [ ] Check image upload works (Cloudinary)
- [ ] Test email sending (Resend)
- [ ] Monitor error logs in Render dashboard
- [ ] Set up custom domain (optional)

---

## What Happens on Free Plan

⚠️ **Important**: Render's free plan spins down after 15 minutes of inactivity.

**First request after spin-down:**
- Takes 30-60 seconds to wake up
- User sees loading/timeout

**Solutions:**
1. Upgrade to paid plan ($7/month for always-on)
2. Add a cron job to ping the API every 10 minutes
3. Accept the cold start on free tier

---

## Next: Deploy Frontend (Vercel)

Once the API is live, deploy the web app to Vercel:

1. Connect GitHub repo to Vercel
2. Set **Root Directory**: `apps/web`
3. Set **Framework Preset**: Next.js
4. Add environment variables (see `apps/web/.env.example`)
5. Set `NEXT_PUBLIC_API_URL` to your Render API URL
6. Deploy!

---

## Need Help?

- **Render Docs**: https://render.com/docs
- **Render Status**: https://status.render.com
- **Neon Docs**: https://neon.tech/docs
- **Check logs**: Render Dashboard → Your Service → Logs
