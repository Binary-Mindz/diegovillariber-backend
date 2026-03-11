/*
  Warnings:

  - You are about to drop the column `userId` on the `RacingVote` table. All the data in the column will be lost.
  - Added the required column `voterId` to the `RacingVote` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RacingVote" DROP CONSTRAINT "RacingVote_postId_fkey";

-- DropForeignKey
ALTER TABLE "RacingVote" DROP CONSTRAINT "RacingVote_userId_fkey";

-- DropIndex
DROP INDEX "RacingVote_userId_postId_key";

-- AlterTable
ALTER TABLE "RacingVote" DROP COLUMN "userId",
ADD COLUMN     "targetUserId" UUID,
ADD COLUMN     "voterId" UUID NOT NULL,
ALTER COLUMN "postId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "RacingVote_voterId_createdAt_idx" ON "RacingVote"("voterId", "createdAt");

-- CreateIndex
CREATE INDEX "RacingVote_targetUserId_idx" ON "RacingVote"("targetUserId");

-- CreateIndex
CREATE INDEX "RacingVote_postId_idx" ON "RacingVote"("postId");

-- AddForeignKey
ALTER TABLE "RacingVote" ADD CONSTRAINT "RacingVote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RacingVote" ADD CONSTRAINT "RacingVote_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RacingVote" ADD CONSTRAINT "RacingVote_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
