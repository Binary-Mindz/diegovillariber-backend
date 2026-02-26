/*
  Warnings:

  - You are about to drop the column `battleId` on the `UserPoint` table. All the data in the column will be lost.
  - You are about to drop the `Battle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChallengeSubmission` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RawShiftStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'RUNNING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RawShiftEntryStatus" AS ENUM ('SUBMITTED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "RawShiftSoftware" AS ENUM ('ANY', 'LIGHTROOM', 'PHOTOSHOP', 'CAPTURE_ONE', 'SNAPSEED', 'OTHER');

-- DropForeignKey
ALTER TABLE "Battle" DROP CONSTRAINT "Battle_hostId_fkey";

-- DropForeignKey
ALTER TABLE "ChallengeSubmission" DROP CONSTRAINT "ChallengeSubmission_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserPoint" DROP CONSTRAINT "UserPoint_battleId_fkey";

-- AlterTable
ALTER TABLE "UserPoint" DROP COLUMN "battleId";

-- DropTable
DROP TABLE "Battle";

-- DropTable
DROP TABLE "ChallengeSubmission";

-- CreateTable
CREATE TABLE "BattleVote" (
    "id" UUID NOT NULL,
    "submissionId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "battleId" UUID NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BattleVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BattleComment" (
    "id" UUID NOT NULL,
    "battleId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "submissionId" UUID,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BattleComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RawShiftBattle" (
    "id" UUID NOT NULL,
    "creatorId" UUID NOT NULL,
    "winnerUserId" UUID,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "coverImage" TEXT,
    "bannerImage" TEXT,
    "software" "RawShiftSoftware" NOT NULL DEFAULT 'ANY',
    "softwareLabel" VARCHAR(100),
    "requireRaw" BOOLEAN NOT NULL DEFAULT true,
    "rejectAiEdited" BOOLEAN NOT NULL DEFAULT false,
    "participantLimit" INTEGER,
    "participationScope" "ParticipationScope" NOT NULL DEFAULT 'GLOBAL',
    "radiusKm" INTEGER,
    "locationName" VARCHAR(150),
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "placeId" VARCHAR(120),
    "startDate" TIMESTAMPTZ(6) NOT NULL,
    "endDate" TIMESTAMPTZ(6) NOT NULL,
    "status" "RawShiftStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "RawShiftBattle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RawShiftParticipant" (
    "id" UUID NOT NULL,
    "battleId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "joinedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),

    CONSTRAINT "RawShiftParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RawShiftEntry" (
    "id" UUID NOT NULL,
    "battleId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "rawMediaUrl" TEXT NOT NULL,
    "rawThumbnailUrl" TEXT,
    "editedMediaUrl" TEXT NOT NULL,
    "editedThumbnailUrl" TEXT,
    "caption" TEXT,
    "hashtags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "RawShiftEntryStatus" NOT NULL DEFAULT 'SUBMITTED',
    "score" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "RawShiftEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RawShiftVote" (
    "id" UUID NOT NULL,
    "entryId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RawShiftVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RawShiftComment" (
    "id" UUID NOT NULL,
    "battleId" UUID,
    "entryId" UUID,
    "userId" UUID NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RawShiftComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BattleVote_battleId_idx" ON "BattleVote"("battleId");

-- CreateIndex
CREATE INDEX "BattleVote_userId_idx" ON "BattleVote"("userId");

-- CreateIndex
CREATE INDEX "BattleVote_submissionId_idx" ON "BattleVote"("submissionId");

-- CreateIndex
CREATE UNIQUE INDEX "BattleVote_submissionId_userId_key" ON "BattleVote"("submissionId", "userId");

-- CreateIndex
CREATE INDEX "BattleComment_battleId_idx" ON "BattleComment"("battleId");

-- CreateIndex
CREATE INDEX "BattleComment_submissionId_idx" ON "BattleComment"("submissionId");

-- CreateIndex
CREATE INDEX "BattleComment_userId_idx" ON "BattleComment"("userId");

-- CreateIndex
CREATE INDEX "RawShiftBattle_creatorId_idx" ON "RawShiftBattle"("creatorId");

-- CreateIndex
CREATE INDEX "RawShiftBattle_status_idx" ON "RawShiftBattle"("status");

-- CreateIndex
CREATE INDEX "RawShiftBattle_startDate_idx" ON "RawShiftBattle"("startDate");

-- CreateIndex
CREATE INDEX "RawShiftBattle_endDate_idx" ON "RawShiftBattle"("endDate");

-- CreateIndex
CREATE INDEX "RawShiftParticipant_userId_idx" ON "RawShiftParticipant"("userId");

-- CreateIndex
CREATE INDEX "RawShiftParticipant_battleId_idx" ON "RawShiftParticipant"("battleId");

-- CreateIndex
CREATE UNIQUE INDEX "RawShiftParticipant_battleId_userId_key" ON "RawShiftParticipant"("battleId", "userId");

-- CreateIndex
CREATE INDEX "RawShiftEntry_battleId_idx" ON "RawShiftEntry"("battleId");

-- CreateIndex
CREATE INDEX "RawShiftEntry_userId_idx" ON "RawShiftEntry"("userId");

-- CreateIndex
CREATE INDEX "RawShiftEntry_score_idx" ON "RawShiftEntry"("score");

-- CreateIndex
CREATE UNIQUE INDEX "RawShiftEntry_battleId_userId_key" ON "RawShiftEntry"("battleId", "userId");

-- CreateIndex
CREATE INDEX "RawShiftVote_userId_idx" ON "RawShiftVote"("userId");

-- CreateIndex
CREATE INDEX "RawShiftVote_entryId_idx" ON "RawShiftVote"("entryId");

-- CreateIndex
CREATE UNIQUE INDEX "RawShiftVote_entryId_userId_key" ON "RawShiftVote"("entryId", "userId");

-- CreateIndex
CREATE INDEX "RawShiftComment_battleId_idx" ON "RawShiftComment"("battleId");

-- CreateIndex
CREATE INDEX "RawShiftComment_entryId_idx" ON "RawShiftComment"("entryId");

-- CreateIndex
CREATE INDEX "RawShiftComment_userId_idx" ON "RawShiftComment"("userId");

-- AddForeignKey
ALTER TABLE "BattleVote" ADD CONSTRAINT "BattleVote_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "BattleSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleVote" ADD CONSTRAINT "BattleVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleVote" ADD CONSTRAINT "BattleVote_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "HeadToHeadBattle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleComment" ADD CONSTRAINT "BattleComment_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "HeadToHeadBattle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleComment" ADD CONSTRAINT "BattleComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleComment" ADD CONSTRAINT "BattleComment_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "BattleSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawShiftBattle" ADD CONSTRAINT "RawShiftBattle_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawShiftBattle" ADD CONSTRAINT "RawShiftBattle_winnerUserId_fkey" FOREIGN KEY ("winnerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawShiftParticipant" ADD CONSTRAINT "RawShiftParticipant_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "RawShiftBattle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawShiftParticipant" ADD CONSTRAINT "RawShiftParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawShiftEntry" ADD CONSTRAINT "RawShiftEntry_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "RawShiftBattle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawShiftEntry" ADD CONSTRAINT "RawShiftEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawShiftVote" ADD CONSTRAINT "RawShiftVote_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "RawShiftEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawShiftVote" ADD CONSTRAINT "RawShiftVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawShiftComment" ADD CONSTRAINT "RawShiftComment_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "RawShiftBattle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawShiftComment" ADD CONSTRAINT "RawShiftComment_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "RawShiftEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawShiftComment" ADD CONSTRAINT "RawShiftComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
