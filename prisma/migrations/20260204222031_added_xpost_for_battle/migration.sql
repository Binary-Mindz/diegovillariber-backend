/*
  Warnings:

  - You are about to drop the column `postId` on the `BattleEntry` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BattleEntry" DROP CONSTRAINT "BattleEntry_postId_fkey";

-- AlterTable
ALTER TABLE "BattleEntry" DROP COLUMN "postId",
ADD COLUMN     "xpostId" UUID;

-- AddForeignKey
ALTER TABLE "BattleEntry" ADD CONSTRAINT "BattleEntry_xpostId_fkey" FOREIGN KEY ("xpostId") REFERENCES "XPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;
