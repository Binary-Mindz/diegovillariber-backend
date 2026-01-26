-- DropForeignKey
ALTER TABLE "UserPoint" DROP CONSTRAINT "UserPoint_battleId_fkey";

-- AlterTable
ALTER TABLE "UserPoint" ADD COLUMN     "followId" UUID,
ALTER COLUMN "battleId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "UserPoint" ADD CONSTRAINT "UserPoint_followId_fkey" FOREIGN KEY ("followId") REFERENCES "Follow"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPoint" ADD CONSTRAINT "UserPoint_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "Battle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
