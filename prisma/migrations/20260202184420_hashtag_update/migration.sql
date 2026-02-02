/*
  Warnings:

  - Added the required column `updatedAt` to the `Hashtag` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "HashtagCreatedBy" AS ENUM ('ADMIN', 'SYSTEM');

-- AlterTable
ALTER TABLE "Hashtag" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" "HashtagCreatedBy" NOT NULL DEFAULT 'ADMIN',
ADD COLUMN     "description" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "usageCount" INTEGER NOT NULL DEFAULT 0;
