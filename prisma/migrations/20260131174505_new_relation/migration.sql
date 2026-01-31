/*
  Warnings:

  - You are about to drop the column `ambassadorRequestUserId` on the `AmbassadorProgram` table. All the data in the column will be lost.
  - You are about to drop the column `requestStatus` on the `AmbassadorProgram` table. All the data in the column will be lost.
  - You are about to drop the column `requestUserId` on the `OfficialPartner` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `AmbassadorProgram` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `OfficialPartner` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `AmbassadorProgram` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `OfficialPartner` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AmbassadorProgram" DROP CONSTRAINT "AmbassadorProgram_ambassadorRequestUserId_fkey";

-- DropForeignKey
ALTER TABLE "OfficialPartner" DROP CONSTRAINT "OfficialPartner_requestUserId_fkey";

-- AlterTable
ALTER TABLE "AmbassadorProgram" DROP COLUMN "ambassadorRequestUserId",
DROP COLUMN "requestStatus",
ADD COLUMN     "status" "AmbassadorStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "userId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "OfficialPartner" DROP COLUMN "requestUserId",
ADD COLUMN     "userId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Report" ALTER COLUMN "media" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AmbassadorProgram_userId_key" ON "AmbassadorProgram"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OfficialPartner_userId_key" ON "OfficialPartner"("userId");

-- AddForeignKey
ALTER TABLE "AmbassadorProgram" ADD CONSTRAINT "AmbassadorProgram_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfficialPartner" ADD CONSTRAINT "OfficialPartner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
