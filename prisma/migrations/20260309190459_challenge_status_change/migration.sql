/*
  Warnings:

  - The values [DRAFT,PUBLISHED,COMPLETED,CANCELLED] on the enum `ChallengeStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ChallengeStatus_new" AS ENUM ('ACTIVE', 'UPCOMING', 'FINISHED');
ALTER TABLE "public"."Challenge" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Challenge" ALTER COLUMN "status" TYPE "ChallengeStatus_new" USING ("status"::text::"ChallengeStatus_new");
ALTER TYPE "ChallengeStatus" RENAME TO "ChallengeStatus_old";
ALTER TYPE "ChallengeStatus_new" RENAME TO "ChallengeStatus";
DROP TYPE "public"."ChallengeStatus_old";
ALTER TABLE "Challenge" ALTER COLUMN "status" SET DEFAULT 'UPCOMING';
COMMIT;

-- AlterTable
ALTER TABLE "Challenge" ALTER COLUMN "status" SET DEFAULT 'UPCOMING';
