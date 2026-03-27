-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "company" TEXT,
    "service" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "dedupeHash" TEXT NOT NULL,
    "isReviewed" BOOLEAN NOT NULL DEFAULT false,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visit" (
    "id" TEXT NOT NULL,
    "visitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "route" TEXT,
    "userAgent" TEXT,
    "ipHash" TEXT,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppConfig" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_username_key" ON "AdminUser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_dedupeHash_key" ON "Lead"("dedupeHash");

-- CreateIndex
CREATE INDEX "Lead_submittedAt_idx" ON "Lead"("submittedAt");

-- CreateIndex
CREATE INDEX "Lead_isReviewed_submittedAt_idx" ON "Lead"("isReviewed", "submittedAt");

-- CreateIndex
CREATE INDEX "Visit_visitedAt_idx" ON "Visit"("visitedAt");

-- CreateIndex
CREATE UNIQUE INDEX "AppConfig_key_key" ON "AppConfig"("key");
