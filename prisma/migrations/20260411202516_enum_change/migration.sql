/*
  Warnings:

  - The values [CITY,HOT_HATCH,SEDAN,SPORT,SUV,SUPERCAR,TRACK,CLASSIC,NAKED,ADVENTURE,TOURING,CUSTOM,SCOOTER,OFF_ROAD,ELECTRIC] on the enum `VehicleCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "VehicleCategory_new" AS ENUM ('TRACKDAY_AMATEUR', 'GT_TOURING', 'ENDURANCE', 'FORMULA', 'RALLY_HILL_CLIMB', 'DRIFT', 'DRAG', 'KARTING', 'SUPER_BIKE', 'MOTOCROSS', 'ENDURO', 'TRIAL', 'RAID');
ALTER TABLE "public"."Post" ALTER COLUMN "vehicleCategory" DROP DEFAULT;
ALTER TABLE "public"."ProDriverProfile" ALTER COLUMN "racingDiscipline" DROP DEFAULT;
ALTER TABLE "Post" ALTER COLUMN "vehicleCategory" TYPE "VehicleCategory_new" USING ("vehicleCategory"::text::"VehicleCategory_new");
ALTER TABLE "ProDriverProfile" ALTER COLUMN "racingDiscipline" TYPE "VehicleCategory_new" USING ("racingDiscipline"::text::"VehicleCategory_new");
ALTER TYPE "VehicleCategory" RENAME TO "VehicleCategory_old";
ALTER TYPE "VehicleCategory_new" RENAME TO "VehicleCategory";
DROP TYPE "public"."VehicleCategory_old";
ALTER TABLE "Post" ALTER COLUMN "vehicleCategory" SET DEFAULT 'MOTOCROSS';
ALTER TABLE "ProDriverProfile" ALTER COLUMN "racingDiscipline" SET DEFAULT 'TRACKDAY_AMATEUR';
COMMIT;

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "vehicleCategory" SET DEFAULT 'MOTOCROSS';

-- AlterTable
ALTER TABLE "ProDriverProfile" ALTER COLUMN "racingDiscipline" SET DEFAULT 'TRACKDAY_AMATEUR';
