# UptimeRobot Setup

## Create Monitors

1. Sign up at [uptimerobot.com](https://uptimerobot.com) (free tier = 50 monitors)
2. Add monitors:
   - **Frontend:** `https://voeq.ng` (every 5 min)
   - **Backend:** `https://api.voeq.ng/health` (every 5 min)
   - **API Cron:** `https://api.voeq.ng/api/cron/tick` (every 5 min)

## Alert Contacts

- Email: `alerts@voeq.ng`
- SMS: Your phone (paid plan, optional)

## Status Page

- Auto-generated: `https://stats.uptimerobot.com/voeq`
- Or custom domain: `status.voeq.ng`
