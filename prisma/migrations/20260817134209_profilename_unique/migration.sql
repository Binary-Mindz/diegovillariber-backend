/*
  Warnings:

  - A unique constraint covering the columns `[profileName]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Profile_profileName_key" ON "Profile"("profileName");
