-- Notifications: new enum + table for the vendor/shopper activity feed.
-- Additive, non-destructive.

CREATE TYPE "NotificationType" AS ENUM (
  'new_follower',
  'new_review',
  'review_response',
  'badge_earned',
  'new_message'
);

CREATE TABLE "Notification" (
  "id"        TEXT NOT NULL,
  "userId"    TEXT NOT NULL,
  "type"      "NotificationType" NOT NULL,
  "payload"   JSONB,
  "readAt"    TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Notification_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification" ("userId", "createdAt");
CREATE INDEX "Notification_userId_readAt_idx" ON "Notification" ("userId", "readAt");
