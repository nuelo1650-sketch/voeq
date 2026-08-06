# Voeq Deployment Checklist

## ✅ What's Done

- [x] Code pushed to GitHub
- [x] Neon database created and seeded
- [x] Database schema deployed (136 institutions, 22 campuses, 20 categories)
- [x] Super admin created: `owidavid2002@gmail.com`
- [x] Build configuration fixed (turbo moved to dependencies)
- [x] render.yaml updated with correct build commands

## 🚀 Next Steps for Render Deployment

### Step 1: Verify Render Auto-Deploy Triggered
- [ ] Go to https://dashboard.render.com
- [ ] Check if **voeq-api** service is building automatically
- [ ] If not, click **Manual Deploy** → **Deploy latest commit**

### Step 2: Set Required Environment Variables
Use `RENDER_ENV_VARS.md` as a reference. Set these in Render dashboard:

**Critical (API won't start without):**
- [ ] `DATABASE_URL` (Neon pooled connection)
- [ ] `AUTH_SECRET` (generate: `openssl rand -base64 32`)
- [ ] `AUTH_GOOGLE_CLIENT_ID` (from Google Cloud Console)
- [ ] `AUTH_GOOGLE_CLIENT_SECRET` (from Google Cloud Console)
- [ ] `RESEND_API_KEY` (from Resend.com)
- [ ] `RESEND_FROM_EMAIL` (your sending email)
- [ ] `CLOUDINARY_CLOUD_NAME` (from Cloudinary)
- [ ] `CLOUDINARY_API_KEY` (from Cloudinary)
- [ ] `CLOUDINARY_API_SECRET` (from Cloudinary)
- [ ] `SIGHTENGINE_USER` (from Sightengine)
- [ ] `SIGHTENGINE_SECRET` (from Sightengine)
- [ ] `CORS_ORIGIN` (your frontend URL, e.g., `https://voeq.vercel.app`)

**Recommended:**
- [ ] `NEXTAUTH_URL` (your frontend URL)
- [ ] `WEB_URL` (your frontend URL)
- [ ] `NEXT_PUBLIC_API_URL` (your Render API URL)
- [ ] `NEXT_PUBLIC_SITE_URL` (your frontend URL)
- [ ] `ADMIN_EMAIL` (admin contact email)
- [ ] `DIRECT_URL` (Neon direct connection for migrations)

### Step 3: Monitor Build Logs
- [ ] Watch build logs in Render dashboard
- [ ] Verify these steps complete successfully:
  - [ ] ✅ Dependencies installed
  - [ ] ✅ Prisma client generated
  - [ ] ✅ TypeScript compiled
  - [ ] ✅ Server started
  - [ ] ✅ Health check passed

### Step 4: Test API Endpoints
Once deployed, test:
- [ ] Health check: `https://your-api.onrender.com/health`
  ```bash
  curl https://your-api.onrender.com/health
  # Should return: {"status":"ok","service":"voeq-api",...}
  ```
- [ ] Version endpoint: `https://your-api.onrender.com/api/version`
- [ ] Categories list: `https://your-api.onrender.com/api/categories`

### Step 5: Configure Custom Domain (Optional)
- [ ] Add custom domain in Render dashboard
- [ ] Update DNS records
- [ ] Wait for SSL certificate provisioning
- [ ] Update `CORS_ORIGIN` to match custom domain

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Connect to Vercel
- [ ] Go to https://vercel.com/new
- [ ] Import `nuelo1650-sketch/voeq` repository
- [ ] Set **Framework Preset**: Next.js
- [ ] Set **Root Directory**: `apps/web`

### Step 2: Set Environment Variables
Copy from `apps/web/.env.example`:

**Required:**
- [ ] `NEXT_PUBLIC_SITE_URL` (e.g., `https://voeq.vercel.app`)
- [ ] `NEXT_PUBLIC_API_URL` (your Render API URL)
- [ ] `DATABASE_URL` (Neon pooled connection)
- [ ] `AUTH_SECRET` (same as API backend)
- [ ] `AUTH_GOOGLE_CLIENT_ID` (same as API backend)
- [ ] `AUTH_GOOGLE_CLIENT_SECRET` (same as API backend)
- [ ] `AUTH_TRUST_HOST=true`
- [ ] `NEXTAUTH_URL` (your Vercel URL)

**Optional:**
- [ ] `NEXT_PUBLIC_POSTHOG_KEY` (analytics)
- [ ] `NEXT_PUBLIC_SENTRY_DSN` (error tracking)
- [ ] `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (bot protection)

### Step 3: Configure Build Settings
- [ ] Build Command: `pnpm run build` (default)
- [ ] Output Directory: `.next` (default)
- [ ] Install Command: `pnpm install` (default)
- [ ] Node Version: `20.x` (from .nvmrc)

### Step 4: Deploy
- [ ] Click **Deploy**
- [ ] Wait for build to complete
- [ ] Test the live site

### Step 5: Update Backend CORS
Once you have the Vercel URL:
- [ ] Go back to Render dashboard
- [ ] Update `CORS_ORIGIN` to your Vercel URL
- [ ] Update `WEB_URL` to your Vercel URL
- [ ] Redeploy API

---

## 🔒 Security Checklist

Before going live:
- [ ] All secrets are unique and secure (not example values)
- [ ] `AUTH_SECRET` is at least 32 characters
- [ ] No `.env` files committed to git
- [ ] Google OAuth redirect URIs configured correctly
- [ ] Neon database has proper firewall rules
- [ ] Rate limiting configured (Upstash or in-memory)
- [ ] HTTPS enforced on all endpoints
- [ ] CORS only allows your frontend domain

---

## 📊 Post-Deployment Testing

### API Tests
```bash
# Health check
curl https://your-api.onrender.com/health

# Get categories
curl https://your-api.onrender.com/api/categories

# Get institutions
curl https://your-api.onrender.com/api/institutions
```

### Frontend Tests
- [ ] Homepage loads
- [ ] Sign up with Google works
- [ ] Browse categories
- [ ] Search listings
- [ ] View vendor profile
- [ ] Image uploads work
- [ ] WhatsApp links work
- [ ] Mobile responsive

### Admin Tests (login as super admin)
- [ ] Access admin dashboard
- [ ] View analytics
- [ ] Approve pending vendors
- [ ] Moderate reviews
- [ ] View audit logs

---

## 🐛 Troubleshooting

### Build fails on Render
- Check `RENDER_DEPLOYMENT.md` troubleshooting section
- Verify turbo is in dependencies (not devDependencies)
- Clear build cache and retry

### API starts but crashes
- Check environment variables are set correctly
- Verify database connection string
- Check logs for specific error messages

### CORS errors on frontend
- Verify `CORS_ORIGIN` matches your Vercel URL exactly
- Include protocol: `https://` not `http://`
- No trailing slash

### Images won't upload
- Verify Cloudinary credentials
- Check Sightengine API keys
- Test Cloudinary directly

### Email not sending
- Verify Resend API key
- Check sending domain is verified in Resend
- Check `RESEND_FROM_EMAIL` format

---

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Neon Docs**: https://neon.tech/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Next.js Docs**: https://nextjs.org/docs

---

## ✨ Success Criteria

Your deployment is successful when:
- ✅ API health endpoint returns 200 OK
- ✅ Frontend loads without errors
- ✅ Users can sign up with Google
- ✅ Database queries work
- ✅ Image uploads work
- ✅ Email sending works
- ✅ No CORS errors in browser console
- ✅ Mobile layout works correctly

**You're ready to launch! 🚀**
