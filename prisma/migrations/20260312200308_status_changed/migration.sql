/*
  Warnings:

  - The values [DRAFT,PUBLISHED,RUNNING,COMPLETED,CANCELLED] on the enum `RawShiftStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RawShiftStatus_new" AS ENUM ('ACTIVE', 'UPCOMING', 'FINISHED');
ALTER TABLE "public"."RawShiftBattle" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "RawShiftBattle" ALTER COLUMN "status" TYPE "RawShiftStatus_new" USING ("status"::text::"RawShiftStatus_new");
ALTER TYPE "RawShiftStatus" RENAME TO "RawShiftStatus_old";
ALTER TYPE "RawShiftStatus_new" RENAME TO "RawShiftStatus";
DROP TYPE "public"."RawShiftStatus_old";
ALTER TABLE "RawShiftBattle" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterTable
ALTER TABLE "RawShiftBattle" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
