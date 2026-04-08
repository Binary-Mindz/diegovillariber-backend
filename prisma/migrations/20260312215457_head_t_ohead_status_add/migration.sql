/*
  Warnings:

  - The values [DRAFT,PUBLISHED,RUNNING,COMPLETED,CANCELLED] on the enum `BattleStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BattleStatus_new" AS ENUM ('ACTIVE', 'UPCOMING', 'FINISHED');
ALTER TABLE "public"."HeadToHeadBattle" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "HeadToHeadBattle" ALTER COLUMN "status" TYPE "BattleStatus_new" USING ("status"::text::"BattleStatus_new");
ALTER TYPE "BattleStatus" RENAME TO "BattleStatus_old";
ALTER TYPE "BattleStatus_new" RENAME TO "BattleStatus";
DROP TYPE "public"."BattleStatus_old";
ALTER TABLE "HeadToHeadBattle" ALTER COLUMN "status" SET DEFAULT 'UPCOMING';
COMMIT;

-- AlterTable
ALTER TABLE "HeadToHeadBattle" ALTER COLUMN "status" SET DEFAULT 'UPCOMING';
