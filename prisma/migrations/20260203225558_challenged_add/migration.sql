/*
  Warnings:

  - The `media` column on the `Challenge` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Challenge" DROP COLUMN "media",
ADD COLUMN     "media" TEXT;
