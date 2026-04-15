-- CreateEnum
CREATE TYPE "BadgeStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DELETED');

-- CreateEnum
CREATE TYPE "BadgeRarity" AS ENUM ('COMMON', 'RARE', 'EPIC', 'LEGENDARY');

-- CreateEnum
CREATE TYPE "BadgeTargetType" AS ENUM ('ANY', 'SPOTTER', 'OWNER', 'CONTENT_CREATOR', 'PRO_BUSSINESS', 'PRO_DRIVER', 'SIM_RACING_DRIVER');

-- CreateTable
CREATE TABLE "badges" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "rarity" "BadgeRarity" NOT NULL DEFAULT 'COMMON',
    "status" "BadgeStatus" NOT NULL DEFAULT 'ACTIVE',
    "targetTypes" "BadgeTargetType"[],
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_badges" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "badgeId" UUID NOT NULL,
    "awardedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,

    CONSTRAINT "profile_badges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "badges_name_key" ON "badges"("name");

-- CreateIndex
CREATE UNIQUE INDEX "badges_slug_key" ON "badges"("slug");

-- CreateIndex
CREATE INDEX "badges_status_sortOrder_idx" ON "badges"("status", "sortOrder");

-- CreateIndex
CREATE INDEX "profile_badges_profileId_idx" ON "profile_badges"("profileId");

-- CreateIndex
CREATE INDEX "profile_badges_badgeId_idx" ON "profile_badges"("badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "profile_badges_profileId_badgeId_key" ON "profile_badges"("profileId", "badgeId");

-- AddForeignKey
ALTER TABLE "profile_badges" ADD CONSTRAINT "profile_badges_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_badges" ADD CONSTRAINT "profile_badges_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "badges"("id") ON DELETE CASCADE ON UPDATE CASCADE;
