/*
  Warnings:

  - You are about to drop the column `postId` on the `ChallengeSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `challengeId` on the `Post` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[challengeId]` on the table `ChallengeResult` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[xpostId]` on the table `ChallengeSubmission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `xpostId` to the `ChallengeSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ChallengeSubmission" DROP CONSTRAINT "ChallengeSubmission_postId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_challengeId_fkey";

-- DropIndex
DROP INDEX "ChallengeSubmission_postId_key";

-- AlterTable
ALTER TABLE "ChallengeSubmission" DROP COLUMN "postId",
ADD COLUMN     "xpostId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "challengeId";

-- CreateTable
CREATE TABLE "XPost" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "battleId" UUID,
    "battleParticipantId" UUID,
    "challengeId" UUID,
    "challengeParticipantId" UUID,
    "postType" "PostType" NOT NULL DEFAULT 'Battle_Post',
    "mediaUrl" TEXT,
    "caption" VARCHAR(2200),
    "like" INTEGER NOT NULL DEFAULT 0,
    "comment" INTEGER NOT NULL DEFAULT 0,
    "share" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "XPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "XPost_userId_idx" ON "XPost"("userId");

-- CreateIndex
CREATE INDEX "XPost_battleId_idx" ON "XPost"("battleId");

-- CreateIndex
CREATE INDEX "XPost_challengeId_idx" ON "XPost"("challengeId");

-- CreateIndex
CREATE INDEX "XPost_postType_idx" ON "XPost"("postType");

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeResult_challengeId_key" ON "ChallengeResult"("challengeId");

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeSubmission_xpostId_key" ON "ChallengeSubmission"("xpostId");

-- AddForeignKey
ALTER TABLE "ChallengeSubmission" ADD CONSTRAINT "ChallengeSubmission_xpostId_fkey" FOREIGN KEY ("xpostId") REFERENCES "XPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XPost" ADD CONSTRAINT "XPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XPost" ADD CONSTRAINT "XPost_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "Battle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XPost" ADD CONSTRAINT "XPost_battleParticipantId_fkey" FOREIGN KEY ("battleParticipantId") REFERENCES "BattleParticipant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XPost" ADD CONSTRAINT "XPost_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XPost" ADD CONSTRAINT "XPost_challengeParticipantId_fkey" FOREIGN KEY ("challengeParticipantId") REFERENCES "ChallengeParticipant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
