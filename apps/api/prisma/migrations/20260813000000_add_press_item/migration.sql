-- CreateTable
CREATE TABLE "PressItem" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'announcement',
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "body" TEXT,
    "publishDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PressItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PressItem_isPublished_idx" ON "PressItem"("isPublished");

-- CreateIndex
CREATE INDEX "PressItem_publishDate_idx" ON "PressItem"("publishDate");
