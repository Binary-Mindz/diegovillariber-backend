/*
  Warnings:

  - You are about to drop the column `battleType` on the `Battle` table. All the data in the column will be lost.
  - You are about to drop the column `brand` on the `Battle` table. All the data in the column will be lost.
  - You are about to drop the column `car` on the `Battle` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Battle` table. All the data in the column will be lost.
  - The `battleCategory` column on the `Battle` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `caption` on the `BattleEntry` table. All the data in the column will be lost.
  - You are about to drop the column `comment` on the `BattleEntry` table. All the data in the column will be lost.
  - You are about to drop the column `hashtag` on the `BattleEntry` table. All the data in the column will be lost.
  - You are about to drop the column `like` on the `BattleEntry` table. All the data in the column will be lost.
  - You are about to drop the column `mediaUrl` on the `BattleEntry` table. All the data in the column will be lost.
  - You are about to drop the column `postType` on the `BattleEntry` table. All the data in the column will be lost.
  - You are about to drop the column `share` on the `BattleEntry` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `BattleEntry` table. All the data in the column will be lost.
  - You are about to drop the column `particepantId` on the `BattleParticipant` table. All the data in the column will be lost.
  - You are about to drop the column `participantId` on the `BattleVote` table. All the data in the column will be lost.
  - You are about to drop the column `votedAt` on the `BattleVote` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[battleId,participantId]` on the table `BattleEntry` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[battleId,userId]` on the table `BattleParticipant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[battleId]` on the table `BattleResult` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[battleId,voterUserId]` on the table `BattleVote` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Battle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postId` to the `BattleEntry` table without a default value. This is not possible if the table is not empty.
  - Made the column `battleId` on table `BattleEntry` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `userId` to the `BattleParticipant` table without a default value. This is not possible if the table is not empty.
  - Made the column `joinedAt` on table `BattleParticipant` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `winnerEntryId` to the `BattleResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entryId` to the `BattleVote` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BattleCategory" AS ENUM ('RAW_SHIFT', 'HEAD_TO_HEAD', 'SPLIT_SCREEN');

-- DropForeignKey
ALTER TABLE "BattleEntry" DROP CONSTRAINT "BattleEntry_battleId_fkey";

-- DropForeignKey
ALTER TABLE "BattleEntry" DROP CONSTRAINT "BattleEntry_participantId_fkey";

-- DropForeignKey
ALTER TABLE "BattleParticipant" DROP CONSTRAINT "BattleParticipant_particepantId_fkey";

-- DropForeignKey
ALTER TABLE "BattleVote" DROP CONSTRAINT "BattleVote_participantId_fkey";

-- AlterTable
ALTER TABLE "Battle" DROP COLUMN "battleType",
DROP COLUMN "brand",
DROP COLUMN "car",
DROP COLUMN "isActive",
ADD COLUMN     "preference" "Preference" NOT NULL DEFAULT 'Car',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "battleCategory",
ADD COLUMN     "battleCategory" "BattleCategory" NOT NULL DEFAULT 'HEAD_TO_HEAD';

-- AlterTable
ALTER TABLE "BattleEntry" DROP COLUMN "caption",
DROP COLUMN "comment",
DROP COLUMN "hashtag",
DROP COLUMN "like",
DROP COLUMN "mediaUrl",
DROP COLUMN "postType",
DROP COLUMN "share",
DROP COLUMN "updatedAt",
ADD COLUMN     "postId" UUID NOT NULL,
ALTER COLUMN "battleId" SET NOT NULL;

-- AlterTable
ALTER TABLE "BattleParticipant" DROP COLUMN "particepantId",
ADD COLUMN     "userId" UUID NOT NULL,
ALTER COLUMN "joinedAt" SET NOT NULL,
ALTER COLUMN "joinedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "BattleResult" ADD COLUMN     "winnerEntryId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "BattleVote" DROP COLUMN "participantId",
DROP COLUMN "votedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "entryId" UUID NOT NULL;

-- DropEnum
DROP TYPE "BattleType";

-- CreateIndex
CREATE INDEX "Battle_status_idx" ON "Battle"("status");

-- CreateIndex
CREATE INDEX "BattleEntry_battleId_idx" ON "BattleEntry"("battleId");

-- CreateIndex
CREATE UNIQUE INDEX "BattleEntry_battleId_participantId_key" ON "BattleEntry"("battleId", "participantId");

-- CreateIndex
CREATE INDEX "BattleParticipant_battleId_idx" ON "BattleParticipant"("battleId");

-- CreateIndex
CREATE UNIQUE INDEX "BattleParticipant_battleId_userId_key" ON "BattleParticipant"("battleId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "BattleResult_battleId_key" ON "BattleResult"("battleId");

-- CreateIndex
CREATE INDEX "BattleVote_battleId_entryId_idx" ON "BattleVote"("battleId", "entryId");

-- CreateIndex
CREATE UNIQUE INDEX "BattleVote_battleId_voterUserId_key" ON "BattleVote"("battleId", "voterUserId");

-- AddForeignKey
ALTER TABLE "BattleEntry" ADD CONSTRAINT "BattleEntry_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "Battle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleEntry" ADD CONSTRAINT "BattleEntry_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "BattleParticipant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleEntry" ADD CONSTRAINT "BattleEntry_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleParticipant" ADD CONSTRAINT "BattleParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleResult" ADD CONSTRAINT "BattleResult_winnerEntryId_fkey" FOREIGN KEY ("winnerEntryId") REFERENCES "BattleEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleVote" ADD CONSTRAINT "BattleVote_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "BattleEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
