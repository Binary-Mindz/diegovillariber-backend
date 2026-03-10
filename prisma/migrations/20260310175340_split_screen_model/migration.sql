-- CreateEnum
CREATE TYPE "SplitScreenBattleStatus" AS ENUM ('OPEN', 'MATCHED', 'LIVE', 'VOTING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SplitScreenCategory" AS ENUM ('STYLES', 'RACING', 'CLASSIC', 'STANCE', 'DRIFT', 'OFF_ROAD');

-- CreateEnum
CREATE TYPE "SplitScreenMatchMode" AS ENUM ('ANYONE', 'ONLINE_ONLY');

-- CreateEnum
CREATE TYPE "SplitScreenVoteStatus" AS ENUM ('ACTIVE', 'REVOKED');

-- CreateEnum
CREATE TYPE "SplitScreenResultType" AS ENUM ('WIN', 'LOSS', 'DRAW');

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "locationStatus" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "SplitScreenBattle" (
    "id" UUID NOT NULL,
    "createdById" UUID NOT NULL,
    "category" "SplitScreenCategory" NOT NULL,
    "status" "SplitScreenBattleStatus" NOT NULL DEFAULT 'OPEN',
    "matchMode" "SplitScreenMatchMode" NOT NULL DEFAULT 'ANYONE',
    "entryCost" INTEGER NOT NULL DEFAULT 0,
    "prizePool" INTEGER NOT NULL DEFAULT 0,
    "winnerRewardPoint" INTEGER NOT NULL DEFAULT 450,
    "isOnlineOnly" BOOLEAN NOT NULL DEFAULT false,
    "startedAt" TIMESTAMP(3),
    "votingStartedAt" TIMESTAMP(3),
    "votingEndsAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "winnerId" UUID,
    "totalVotes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SplitScreenBattle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SplitScreenParticipant" (
    "id" UUID NOT NULL,
    "battleId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "profileId" UUID,
    "carBrand" TEXT,
    "carModel" TEXT,
    "carYear" INTEGER,
    "carImageUrl" TEXT,
    "lane" INTEGER NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "isWinner" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SplitScreenParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SplitScreenVote" (
    "id" UUID NOT NULL,
    "battleId" UUID NOT NULL,
    "voterId" UUID NOT NULL,
    "participantId" UUID NOT NULL,
    "status" "SplitScreenVoteStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SplitScreenVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SplitScreenReward" (
    "id" UUID NOT NULL,
    "battleId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "points" INTEGER NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SplitScreenReward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SplitScreenResult" (
    "id" UUID NOT NULL,
    "battleId" UUID NOT NULL,
    "participantId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "result" "SplitScreenResultType" NOT NULL,
    "earnedPoints" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SplitScreenResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SplitScreenBattle_status_idx" ON "SplitScreenBattle"("status");

-- CreateIndex
CREATE INDEX "SplitScreenBattle_category_idx" ON "SplitScreenBattle"("category");

-- CreateIndex
CREATE INDEX "SplitScreenBattle_createdById_idx" ON "SplitScreenBattle"("createdById");

-- CreateIndex
CREATE INDEX "SplitScreenBattle_winnerId_idx" ON "SplitScreenBattle"("winnerId");

-- CreateIndex
CREATE INDEX "SplitScreenParticipant_userId_idx" ON "SplitScreenParticipant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SplitScreenParticipant_battleId_userId_key" ON "SplitScreenParticipant"("battleId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "SplitScreenParticipant_battleId_lane_key" ON "SplitScreenParticipant"("battleId", "lane");

-- CreateIndex
CREATE INDEX "SplitScreenVote_participantId_idx" ON "SplitScreenVote"("participantId");

-- CreateIndex
CREATE INDEX "SplitScreenVote_voterId_idx" ON "SplitScreenVote"("voterId");

-- CreateIndex
CREATE UNIQUE INDEX "SplitScreenVote_battleId_voterId_key" ON "SplitScreenVote"("battleId", "voterId");

-- CreateIndex
CREATE INDEX "SplitScreenReward_battleId_idx" ON "SplitScreenReward"("battleId");

-- CreateIndex
CREATE INDEX "SplitScreenReward_userId_idx" ON "SplitScreenReward"("userId");

-- CreateIndex
CREATE INDEX "SplitScreenResult_battleId_idx" ON "SplitScreenResult"("battleId");

-- CreateIndex
CREATE INDEX "SplitScreenResult_userId_idx" ON "SplitScreenResult"("userId");

-- AddForeignKey
ALTER TABLE "SplitScreenBattle" ADD CONSTRAINT "SplitScreenBattle_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenBattle" ADD CONSTRAINT "SplitScreenBattle_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenParticipant" ADD CONSTRAINT "SplitScreenParticipant_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "SplitScreenBattle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenParticipant" ADD CONSTRAINT "SplitScreenParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenVote" ADD CONSTRAINT "SplitScreenVote_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "SplitScreenBattle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenVote" ADD CONSTRAINT "SplitScreenVote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenVote" ADD CONSTRAINT "SplitScreenVote_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "SplitScreenParticipant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenReward" ADD CONSTRAINT "SplitScreenReward_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "SplitScreenBattle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenReward" ADD CONSTRAINT "SplitScreenReward_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenResult" ADD CONSTRAINT "SplitScreenResult_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "SplitScreenBattle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenResult" ADD CONSTRAINT "SplitScreenResult_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "SplitScreenParticipant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenResult" ADD CONSTRAINT "SplitScreenResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
