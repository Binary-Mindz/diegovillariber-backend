/*
  Warnings:

  - Made the column `trackLayout` on table `LabTime` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "LabTime" ALTER COLUMN "trackLayout" SET NOT NULL,
ALTER COLUMN "dateSet" DROP NOT NULL,
ALTER COLUMN "transmission" DROP NOT NULL,
ALTER COLUMN "drivetrain" DROP NOT NULL,
ALTER COLUMN "timeOfDay" DROP NOT NULL,
ALTER COLUMN "sessionType" DROP NOT NULL,
ALTER COLUMN "weather" DROP NOT NULL,
ALTER COLUMN "trackCondition" DROP NOT NULL,
ALTER COLUMN "tireBrand" DROP NOT NULL,
ALTER COLUMN "tireModel" DROP NOT NULL,
ALTER COLUMN "tireCompund" DROP NOT NULL,
ALTER COLUMN "drivingStyle" DROP NOT NULL,
ALTER COLUMN "additionalNotes" DROP NOT NULL,
ALTER COLUMN "telemetryMedia" DROP NOT NULL;
