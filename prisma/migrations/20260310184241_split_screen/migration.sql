/*
  Warnings:

  - The values [MATCHED] on the enum `SplitScreenBattleStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `createdById` on the `SplitScreenBattle` table. All the data in the column will be lost.
  - You are about to drop the column `isOnlineOnly` on the `SplitScreenBattle` table. All the data in the column will be lost.
  - You are about to drop the column `matchMode` on the `SplitScreenBattle` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `SplitScreenBattle` table. All the data in the column will be lost.
  - You are about to drop the column `votingStartedAt` on the `SplitScreenBattle` table. All the data in the column will be lost.
  - You are about to drop the column `winnerRewardPoint` on the `SplitScreenBattle` table. All the data in the column will be lost.
  - You are about to drop the column `result` on the `SplitScreenResult` table. All the data in the column will be lost.
  - You are about to drop the column `participantId` on the `SplitScreenVote` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `SplitScreenVote` table. All the data in the column will be lost.
  - You are about to drop the column `voterId` on the `SplitScreenVote` table. All the data in the column will be lost.
  - You are about to drop the `SplitScreenReward` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[battleId,userId]` on the table `SplitScreenVote` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `creatorId` to the `SplitScreenBattle` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `category` on the `SplitScreenBattle` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `resultType` to the `SplitScreenResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submissionId` to the `SplitScreenVote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `SplitScreenVote` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SplitScreenBattleCategory" AS ENUM ('STYLES', 'RACING', 'CLASSIC', 'STANCE', 'DRIFT', 'OFF_ROAD');

-- CreateEnum
CREATE TYPE "SplitScreenMatchmakingMode" AS ENUM ('ANYONE', 'ONLINE_ONLY');

-- CreateEnum
CREATE TYPE "SplitScreenPreferenceMode" AS ENUM ('ANY_CAR_BRAND', 'SAME_BRAND_ONLY', 'SAME_MODEL_ONLY', 'SPECIFIC_BRAND', 'SIMILAR_PRESTIGE');

-- CreateEnum
CREATE TYPE "SplitScreenInvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "SplitScreenSubmissionStatus" AS ENUM ('PENDING', 'SUBMITTED');

-- CreateEnum
CREATE TYPE "SplitScreenVoteType" AS ENUM ('UPVOTE');

-- AlterEnum
BEGIN;
CREATE TYPE "SplitScreenBattleStatus_new" AS ENUM ('DRAFT', 'OPEN', 'LIVE', 'VOTING', 'COMPLETED', 'CANCELLED');
ALTER TABLE "public"."SplitScreenBattle" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "SplitScreenBattle" ALTER COLUMN "status" TYPE "SplitScreenBattleStatus_new" USING ("status"::text::"SplitScreenBattleStatus_new");
ALTER TYPE "SplitScreenBattleStatus" RENAME TO "SplitScreenBattleStatus_old";
ALTER TYPE "SplitScreenBattleStatus_new" RENAME TO "SplitScreenBattleStatus";
DROP TYPE "public"."SplitScreenBattleStatus_old";
ALTER TABLE "SplitScreenBattle" ALTER COLUMN "status" SET DEFAULT 'OPEN';
COMMIT;

-- DropForeignKey
ALTER TABLE "SplitScreenBattle" DROP CONSTRAINT "SplitScreenBattle_createdById_fkey";

-- DropForeignKey
ALTER TABLE "SplitScreenReward" DROP CONSTRAINT "SplitScreenReward_battleId_fkey";

-- DropForeignKey
ALTER TABLE "SplitScreenReward" DROP CONSTRAINT "SplitScreenReward_userId_fkey";

-- DropForeignKey
ALTER TABLE "SplitScreenVote" DROP CONSTRAINT "SplitScreenVote_participantId_fkey";

-- DropForeignKey
ALTER TABLE "SplitScreenVote" DROP CONSTRAINT "SplitScreenVote_voterId_fkey";

-- DropIndex
DROP INDEX "SplitScreenBattle_createdById_idx";

-- DropIndex
DROP INDEX "SplitScreenVote_battleId_voterId_key";

-- DropIndex
DROP INDEX "SplitScreenVote_participantId_idx";

-- DropIndex
DROP INDEX "SplitScreenVote_voterId_idx";

-- AlterTable
ALTER TABLE "SplitScreenBattle" DROP COLUMN "createdById",
DROP COLUMN "isOnlineOnly",
DROP COLUMN "matchMode",
DROP COLUMN "startedAt",
DROP COLUMN "votingStartedAt",
DROP COLUMN "winnerRewardPoint",
ADD COLUMN     "accessType" "BattleAccessType" NOT NULL DEFAULT 'OPEN',
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "creatorId" UUID NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "matchmakingMode" "SplitScreenMatchmakingMode" NOT NULL DEFAULT 'ANYONE',
ADD COLUMN     "maxParticipants" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN     "preferenceMode" "SplitScreenPreferenceMode" NOT NULL DEFAULT 'ANY_CAR_BRAND',
ADD COLUMN     "preferredBrand" TEXT,
ADD COLUMN     "similarPrestigeRange" INTEGER,
ADD COLUMN     "startsAt" TIMESTAMP(3),
ADD COLUMN     "title" TEXT,
ADD COLUMN     "totalComments" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "votingDurationHours" INTEGER NOT NULL DEFAULT 24,
ADD COLUMN     "votingStartsAt" TIMESTAMP(3),
ADD COLUMN     "winnerPointReward" INTEGER NOT NULL DEFAULT 450,
DROP COLUMN "category",
ADD COLUMN     "category" "SplitScreenBattleCategory" NOT NULL;

-- AlterTable
ALTER TABLE "SplitScreenParticipant" ADD COLUMN     "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "prestigePoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "submissionStatus" "SplitScreenSubmissionStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "SplitScreenResult" DROP COLUMN "result",
ADD COLUMN     "resultType" "SplitScreenResultType" NOT NULL;

-- AlterTable
ALTER TABLE "SplitScreenVote" DROP COLUMN "participantId",
DROP COLUMN "status",
DROP COLUMN "voterId",
ADD COLUMN     "submissionId" UUID NOT NULL,
ADD COLUMN     "userId" UUID NOT NULL,
ADD COLUMN     "voteType" "SplitScreenVoteType" NOT NULL DEFAULT 'UPVOTE';

-- DropTable
DROP TABLE "SplitScreenReward";

-- DropEnum
DROP TYPE "SplitScreenCategory";

-- DropEnum
DROP TYPE "SplitScreenMatchMode";

-- DropEnum
DROP TYPE "SplitScreenVoteStatus";

-- CreateTable
CREATE TABLE "SplitScreenInvitation" (
    "id" UUID NOT NULL,
    "battleId" UUID NOT NULL,
    "inviterId" UUID NOT NULL,
    "inviteeId" UUID NOT NULL,
    "status" "SplitScreenInvitationStatus" NOT NULL DEFAULT 'PENDING',
    "respondedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SplitScreenInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SplitScreenSubmission" (
    "id" UUID NOT NULL,
    "battleId" UUID NOT NULL,
    "participantId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "mediaUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "caption" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SplitScreenSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SplitScreenComment" (
    "id" UUID NOT NULL,
    "battleId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "submissionId" UUID,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SplitScreenComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SplitScreenBattleToUserPoint" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_SplitScreenBattleToUserPoint_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "SplitScreenInvitation_battleId_idx" ON "SplitScreenInvitation"("battleId");

-- CreateIndex
CREATE INDEX "SplitScreenInvitation_inviterId_idx" ON "SplitScreenInvitation"("inviterId");

-- CreateIndex
CREATE INDEX "SplitScreenInvitation_inviteeId_idx" ON "SplitScreenInvitation"("inviteeId");

-- CreateIndex
CREATE INDEX "SplitScreenInvitation_status_idx" ON "SplitScreenInvitation"("status");

-- CreateIndex
CREATE UNIQUE INDEX "SplitScreenInvitation_battleId_inviteeId_key" ON "SplitScreenInvitation"("battleId", "inviteeId");

-- CreateIndex
CREATE UNIQUE INDEX "SplitScreenSubmission_participantId_key" ON "SplitScreenSubmission"("participantId");

-- CreateIndex
CREATE INDEX "SplitScreenSubmission_battleId_idx" ON "SplitScreenSubmission"("battleId");

-- CreateIndex
CREATE INDEX "SplitScreenSubmission_userId_idx" ON "SplitScreenSubmission"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SplitScreenSubmission_battleId_userId_key" ON "SplitScreenSubmission"("battleId", "userId");

-- CreateIndex
CREATE INDEX "SplitScreenComment_battleId_idx" ON "SplitScreenComment"("battleId");

-- CreateIndex
CREATE INDEX "SplitScreenComment_userId_idx" ON "SplitScreenComment"("userId");

-- CreateIndex
CREATE INDEX "SplitScreenComment_submissionId_idx" ON "SplitScreenComment"("submissionId");

-- CreateIndex
CREATE INDEX "_SplitScreenBattleToUserPoint_B_index" ON "_SplitScreenBattleToUserPoint"("B");

-- CreateIndex
CREATE INDEX "SplitScreenBattle_creatorId_idx" ON "SplitScreenBattle"("creatorId");

-- CreateIndex
CREATE INDEX "SplitScreenBattle_category_idx" ON "SplitScreenBattle"("category");

-- CreateIndex
CREATE INDEX "SplitScreenBattle_createdAt_idx" ON "SplitScreenBattle"("createdAt");

-- CreateIndex
CREATE INDEX "SplitScreenVote_submissionId_idx" ON "SplitScreenVote"("submissionId");

-- CreateIndex
CREATE INDEX "SplitScreenVote_userId_idx" ON "SplitScreenVote"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SplitScreenVote_battleId_userId_key" ON "SplitScreenVote"("battleId", "userId");

-- AddForeignKey
ALTER TABLE "SplitScreenBattle" ADD CONSTRAINT "SplitScreenBattle_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenInvitation" ADD CONSTRAINT "SplitScreenInvitation_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "SplitScreenBattle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenInvitation" ADD CONSTRAINT "SplitScreenInvitation_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenInvitation" ADD CONSTRAINT "SplitScreenInvitation_inviteeId_fkey" FOREIGN KEY ("inviteeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenSubmission" ADD CONSTRAINT "SplitScreenSubmission_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "SplitScreenBattle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenSubmission" ADD CONSTRAINT "SplitScreenSubmission_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "SplitScreenParticipant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenSubmission" ADD CONSTRAINT "SplitScreenSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenVote" ADD CONSTRAINT "SplitScreenVote_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "SplitScreenSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenVote" ADD CONSTRAINT "SplitScreenVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenComment" ADD CONSTRAINT "SplitScreenComment_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "SplitScreenBattle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenComment" ADD CONSTRAINT "SplitScreenComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenComment" ADD CONSTRAINT "SplitScreenComment_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "SplitScreenSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SplitScreenBattleToUserPoint" ADD CONSTRAINT "_SplitScreenBattleToUserPoint_A_fkey" FOREIGN KEY ("A") REFERENCES "SplitScreenBattle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SplitScreenBattleToUserPoint" ADD CONSTRAINT "_SplitScreenBattleToUserPoint_B_fkey" FOREIGN KEY ("B") REFERENCES "UserPoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
