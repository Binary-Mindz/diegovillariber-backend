/*
  Warnings:

  - The values [DRAFT] on the enum `RawShiftStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RawShiftStatus_new" AS ENUM ('PUBLISHED', 'RUNNING', 'COMPLETED', 'CANCELLED');
ALTER TABLE "public"."RawShiftBattle" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "RawShiftBattle" ALTER COLUMN "status" TYPE "RawShiftStatus_new" USING ("status"::text::"RawShiftStatus_new");
ALTER TYPE "RawShiftStatus" RENAME TO "RawShiftStatus_old";
ALTER TYPE "RawShiftStatus_new" RENAME TO "RawShiftStatus";
DROP TYPE "public"."RawShiftStatus_old";
ALTER TABLE "RawShiftBattle" ALTER COLUMN "status" SET DEFAULT 'PUBLISHED';
COMMIT;

-- AlterTable
ALTER TABLE "ProductList" ADD COLUMN     "location" TEXT;

-- AlterTable
ALTER TABLE "RawShiftBattle" ALTER COLUMN "status" SET DEFAULT 'PUBLISHED';
