/*
  Warnings:

  - A unique constraint covering the columns `[userId,profileType]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Profile_userId_profileType_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_profileType_key" ON "Profile"("userId", "profileType");
