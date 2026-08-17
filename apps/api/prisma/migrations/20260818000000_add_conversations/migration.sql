-- Phase 3 Stage 1: Conversations + Messages for chat/inquiry history.
-- Additive, non-destructive.

-- 1. Add the new event-type value to the existing EventType enum.
--    (ALTER TYPE ... ADD VALUE cannot run inside a transaction block in older
--     Postgres, but prisma executes migrations outside an explicit txn.)
ALTER TYPE "EventType" ADD VALUE IF NOT EXISTS 'conversation_started';

-- 2. Conversation table.
CREATE TABLE "Conversation" (
  "id"            TEXT NOT NULL,
  "shopperId"     TEXT NOT NULL,
  "vendorId"      TEXT NOT NULL,
  "listingId"     TEXT,
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Conversation_shopperId_fkey" FOREIGN KEY ("shopperId")
    REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Conversation_vendorId_fkey" FOREIGN KEY ("vendorId")
    REFERENCES "Vendor" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Conversation_listingId_fkey" FOREIGN KEY ("listingId")
    REFERENCES "Listing" ("id") ON DELETE SET NULL ON UPDATE CASCADE,

  CONSTRAINT "Conversation_shopperId_vendorId_key" UNIQUE ("shopperId", "vendorId")
);

CREATE INDEX "Conversation_vendorId_lastMessageAt_idx" ON "Conversation" ("vendorId", "lastMessageAt");
CREATE INDEX "Conversation_shopperId_lastMessageAt_idx" ON "Conversation" ("shopperId", "lastMessageAt");

-- 3. Message table.
CREATE TABLE "Message" (
  "id"             TEXT NOT NULL,
  "conversationId" TEXT NOT NULL,
  "senderId"       TEXT NOT NULL,
  "body"           TEXT NOT NULL,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "readAt"         TIMESTAMP(3),

  CONSTRAINT "Message_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId")
    REFERENCES "Conversation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId")
    REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "Message_conversationId_createdAt_idx" ON "Message" ("conversationId", "createdAt");
