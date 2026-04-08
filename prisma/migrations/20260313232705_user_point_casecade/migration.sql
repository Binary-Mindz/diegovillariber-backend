-- DropForeignKey
ALTER TABLE "UserPoint" DROP CONSTRAINT "UserPoint_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserPoint" ADD CONSTRAINT "UserPoint_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
