# Cloudinary Setup

## Create Account

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Dashboard → Account Details
3. Copy: Cloud Name, API Key, API Secret

## Upload Preset

1. Settings → Upload
2. Add upload preset: `voeq_signed`
3. Signing mode: Signed
4. Folder: `voeq`
5. Transformations: `f_auto,q_auto`

## Environment Variables

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## Free Tier Limits

- 25 credits/month
- 25 GB storage
- 25 GB bandwidth
- Monitor usage in admin dashboard
