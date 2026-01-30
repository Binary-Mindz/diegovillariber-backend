/*
  Warnings:

  - Changed the type of `media` on the `Report` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "media",
ADD COLUMN     "media" TEXT NOT NULL;
