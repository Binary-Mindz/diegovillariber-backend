/*
  Warnings:

  - You are about to drop the `UserPoint` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PrestigeRuleStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "UserPointSourceType" AS ENUM ('POST', 'LIKE', 'COMMENT', 'FOLLOW', 'MANUAL', 'EVENT', 'BATTLE', 'OTHER');

-- DropForeignKey
ALTER TABLE "UserPoint" DROP CONSTRAINT "UserPoint_commentId_fkey";

-- DropForeignKey
ALTER TABLE "UserPoint" DROP CONSTRAINT "UserPoint_followId_fkey";

-- DropForeignKey
ALTER TABLE "UserPoint" DROP CONSTRAINT "UserPoint_likeId_fkey";

-- DropForeignKey
ALTER TABLE "UserPoint" DROP CONSTRAINT "UserPoint_postId_fkey";

-- DropForeignKey
ALTER TABLE "UserPoint" DROP CONSTRAINT "UserPoint_userId_fkey";

-- DropTable
DROP TABLE "UserPoint";

-- CreateTable
CREATE TABLE "prestige_rules" (
    "id" UUID NOT NULL,
    "earnBy" TEXT NOT NULL,
    "point" INTEGER NOT NULL,
    "dailyCap" INTEGER NOT NULL DEFAULT 0,
    "weeklyCap" INTEGER NOT NULL DEFAULT 0,
    "cooldownSeconds" INTEGER NOT NULL DEFAULT 0,
    "status" "PrestigeRuleStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prestige_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_points" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "sourceType" "UserPointSourceType" NOT NULL,
    "sourceId" UUID,
    "earnBy" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_points_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "prestige_rules_earnBy_key" ON "prestige_rules"("earnBy");

-- CreateIndex
CREATE INDEX "prestige_rules_status_idx" ON "prestige_rules"("status");

-- CreateIndex
CREATE INDEX "prestige_rules_earnBy_idx" ON "prestige_rules"("earnBy");

-- CreateIndex
CREATE INDEX "user_points_userId_createdAt_idx" ON "user_points"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "user_points_earnBy_idx" ON "user_points"("earnBy");

-- CreateIndex
CREATE INDEX "user_points_sourceType_sourceId_idx" ON "user_points"("sourceType", "sourceId");

-- AddForeignKey
ALTER TABLE "user_points" ADD CONSTRAINT "user_points_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
