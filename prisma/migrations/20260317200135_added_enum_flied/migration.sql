/*
  Warnings:

  - The values [BRAND] on the enum `ChallengeCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ChallengeCategory_new" AS ENUM ('DAILY', 'SPOTTER', 'COMMUNITY', 'SPONSORED', 'GEOGRAPHY');
ALTER TABLE "Challenge" ALTER COLUMN "category" TYPE "ChallengeCategory_new" USING ("category"::text::"ChallengeCategory_new");
ALTER TYPE "ChallengeCategory" RENAME TO "ChallengeCategory_old";
ALTER TYPE "ChallengeCategory_new" RENAME TO "ChallengeCategory";
DROP TYPE "public"."ChallengeCategory_old";
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "HeaderName" ADD VALUE 'MARKETPLACE';
ALTER TYPE "HeaderName" ADD VALUE 'HEAD_TO_HEAD';
