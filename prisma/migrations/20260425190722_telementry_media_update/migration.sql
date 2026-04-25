/*
  Warnings:

  - The `telemetryMedia` column on the `LabTime` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "LabTime" DROP COLUMN "telemetryMedia",
ADD COLUMN     "telemetryMedia" JSONB NOT NULL DEFAULT '[]';
