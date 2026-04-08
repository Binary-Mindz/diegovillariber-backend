/*
  Warnings:

  - A unique constraint covering the columns `[shareSlug]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "shareCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "shareQrPath" TEXT,
ADD COLUMN     "shareSlug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_shareSlug_key" ON "Profile"("shareSlug");
