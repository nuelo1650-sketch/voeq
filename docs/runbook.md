# Voeq Incident Response Runbook

## Service Down (UptimeRobot Alert)

1. Check Render status: https://status.render.com
2. Check Vercel status: https://vercel-status.com
3. Check Neon status: https://neonstatus.com
4. If Render down: Restart service in Render dashboard
5. If Vercel down: Check deployments, rollback if needed
6. If Neon down: Check Neon dashboard, failover if needed
7. Post status update: UptimeRobot public status page
8. Notify users via Twitter/Instagram if outage > 30 min

## High Error Rate (Sentry Alert)

1. Open Sentry dashboard
2. Identify error type (database, API, frontend)
3. If database: Check Neon dashboard for connection issues
4. If API: Check Render logs
5. If frontend: Check Vercel deployment
6. Rollback last deployment if error started after deploy
7. Post-mortem within 24 hours

## Database Issues

1. Check Neon dashboard
2. Check connection pool exhaustion
3. Check slow queries (enable `log_queries` temporarily)
4. Optimize or add indexes
5. If data corruption: Restore from latest backup
6. Verify backup integrity (test restore on staging)

## Security Incident

1. Identify scope: Which users/data affected?
2. Rotate all secrets immediately (Resend, Cloudinary, Sentry, PostHog, etc.)
3. Check audit log for suspicious activity
4. Notify affected users (within 72 hours per NDPR)
5. File incident report
6. Implement preventive measures

## Cloudinary Quota Exceeded

1. Check usage in Cloudinary dashboard
2. Identify large files (admin can see in PostHog)
3. Delete unused images
4. Upgrade to paid plan ($99/mo for 225GB)
5. Implement image archival (move to cold storage)

## Neon Compute Hours Exhausted

1. Check usage in Neon dashboard
2. Optimize queries (add indexes, reduce N+1)
3. Enable connection pooling
4. Upgrade to Launch plan ($19/mo for 300 hrs)

## Render Free Tier Sleep

1. Check UptimeRobot (should keep it awake)
2. If sleeping, first request will be slow (~30s)
3. Upgrade to Starter plan ($7/mo) for always-on
