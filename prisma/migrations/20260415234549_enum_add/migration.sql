/*
  Warnings:

  - The `vehicleCategory` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PostVehicleCategory" AS ENUM ('CITY', 'HOT_HATCH', 'SEDAN', 'SPORT', 'SUV', 'SUPERCAR', 'TRACK', 'CLASSIC', 'SPORT_BIKE', 'NAKED', 'ADVENTURE', 'TOURING', 'CUSTOM', 'SCOOTER', 'OFF_ROAD', 'MOTOCROSS', 'ENDURO', 'TRIAL', 'CLASSIC_VINTAGE', 'ELECTRIC');

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "vehicleCategory",
ADD COLUMN     "vehicleCategory" "PostVehicleCategory" NOT NULL DEFAULT 'CITY';
