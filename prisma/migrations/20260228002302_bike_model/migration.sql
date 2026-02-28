/*
  Warnings:

  - Added the required column `targetType` to the `LegalNotice` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LegalNoticeTarget" AS ENUM ('CAR', 'BIKE');

-- CreateEnum
CREATE TYPE "BikeBodyType" AS ENUM ('Sport', 'Naked', 'Adventure', 'Touring', 'Custom', 'Scooter', 'Off_Road', 'Motocross', 'Enduro', 'Trial', 'Classic', 'Electric');

-- DropForeignKey
ALTER TABLE "LegalNotice" DROP CONSTRAINT "LegalNotice_carId_fkey";

-- AlterTable
ALTER TABLE "LegalNotice" ADD COLUMN     "bikeId" UUID,
ADD COLUMN     "targetType" "LegalNoticeTarget" NOT NULL,
ALTER COLUMN "carId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Bike" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "garageId" UUID NOT NULL,
    "image" TEXT,
    "make" TEXT,
    "model" TEXT,
    "bodyType" "BikeBodyType" NOT NULL DEFAULT 'Sport',
    "transmission" "Transmission" NOT NULL DEFAULT 'MANUAL',
    "driveTrain" "DriveTrain" NOT NULL DEFAULT 'RWD',
    "country" TEXT,
    "color" TEXT,
    "displayName" TEXT,
    "description" TEXT,
    "category" "DriveCategory" NOT NULL DEFAULT 'Daily_Drive',
    "listOnMarketplace" BOOLEAN NOT NULL DEFAULT false,
    "price" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Bike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdvancedBikeData" (
    "id" UUID NOT NULL,
    "bikeId" UUID NOT NULL,

    CONSTRAINT "AdvancedBikeData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EngineAndPerformance" (
    "id" UUID NOT NULL,
    "advancedBikeDataId" UUID NOT NULL,
    "engineType" TEXT NOT NULL,
    "displacement" INTEGER,
    "power" INTEGER,
    "torque" INTEGER,
    "ecu" TEXT,

    CONSTRAINT "EngineAndPerformance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BikeDriveTrains" (
    "id" UUID NOT NULL,
    "advancedBikeDataId" UUID NOT NULL,
    "transmissionMods" TEXT,
    "differential" TEXT,
    "clutch" TEXT,

    CONSTRAINT "BikeDriveTrains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Suspension" (
    "id" UUID NOT NULL,
    "advancedBikeDataId" UUID NOT NULL,
    "frontSuspension" TEXT,
    "rearSuspension" TEXT,
    "frontBrakes" TEXT,
    "rearBrake" TEXT,
    "abs" TEXT,
    "notes" TEXT,

    CONSTRAINT "Suspension_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BikeWheelTires" (
    "id" UUID NOT NULL,
    "advancedBikeDataId" UUID NOT NULL,
    "wheels" TEXT,
    "tires" TEXT,

    CONSTRAINT "BikeWheelTires_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BikeElectronics" (
    "id" UUID NOT NULL,
    "advancedBikeDataId" UUID NOT NULL,
    "riding" TEXT,
    "tractionControl" TEXT,
    "wheelieControl" TEXT,

    CONSTRAINT "BikeElectronics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BikeUsageAndNotes" (
    "id" UUID NOT NULL,
    "advancedBikeDataId" UUID NOT NULL,
    "weight" INTEGER,
    "primaryUsage" TEXT,
    "ridingLevel" TEXT,
    "buildStatus" TEXT,
    "notes" TEXT,

    CONSTRAINT "BikeUsageAndNotes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Bike_profileId_idx" ON "Bike"("profileId");

-- CreateIndex
CREATE INDEX "Bike_garageId_idx" ON "Bike"("garageId");

-- CreateIndex
CREATE INDEX "Bike_listOnMarketplace_idx" ON "Bike"("listOnMarketplace");

-- CreateIndex
CREATE INDEX "Bike_category_idx" ON "Bike"("category");

-- CreateIndex
CREATE INDEX "Bike_make_model_idx" ON "Bike"("make", "model");

-- CreateIndex
CREATE INDEX "Bike_profileId_category_idx" ON "Bike"("profileId", "category");

-- CreateIndex
CREATE UNIQUE INDEX "EngineAndPerformance_advancedBikeDataId_key" ON "EngineAndPerformance"("advancedBikeDataId");

-- CreateIndex
CREATE UNIQUE INDEX "BikeDriveTrains_advancedBikeDataId_key" ON "BikeDriveTrains"("advancedBikeDataId");

-- CreateIndex
CREATE UNIQUE INDEX "Suspension_advancedBikeDataId_key" ON "Suspension"("advancedBikeDataId");

-- CreateIndex
CREATE UNIQUE INDEX "BikeWheelTires_advancedBikeDataId_key" ON "BikeWheelTires"("advancedBikeDataId");

-- CreateIndex
CREATE UNIQUE INDEX "BikeElectronics_advancedBikeDataId_key" ON "BikeElectronics"("advancedBikeDataId");

-- CreateIndex
CREATE UNIQUE INDEX "BikeUsageAndNotes_advancedBikeDataId_key" ON "BikeUsageAndNotes"("advancedBikeDataId");

-- AddForeignKey
ALTER TABLE "Bike" ADD CONSTRAINT "Bike_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bike" ADD CONSTRAINT "Bike_garageId_fkey" FOREIGN KEY ("garageId") REFERENCES "Garage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdvancedBikeData" ADD CONSTRAINT "AdvancedBikeData_bikeId_fkey" FOREIGN KEY ("bikeId") REFERENCES "Bike"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EngineAndPerformance" ADD CONSTRAINT "EngineAndPerformance_advancedBikeDataId_fkey" FOREIGN KEY ("advancedBikeDataId") REFERENCES "AdvancedBikeData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BikeDriveTrains" ADD CONSTRAINT "BikeDriveTrains_advancedBikeDataId_fkey" FOREIGN KEY ("advancedBikeDataId") REFERENCES "AdvancedBikeData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Suspension" ADD CONSTRAINT "Suspension_advancedBikeDataId_fkey" FOREIGN KEY ("advancedBikeDataId") REFERENCES "AdvancedBikeData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BikeWheelTires" ADD CONSTRAINT "BikeWheelTires_advancedBikeDataId_fkey" FOREIGN KEY ("advancedBikeDataId") REFERENCES "AdvancedBikeData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BikeElectronics" ADD CONSTRAINT "BikeElectronics_advancedBikeDataId_fkey" FOREIGN KEY ("advancedBikeDataId") REFERENCES "AdvancedBikeData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BikeUsageAndNotes" ADD CONSTRAINT "BikeUsageAndNotes_advancedBikeDataId_fkey" FOREIGN KEY ("advancedBikeDataId") REFERENCES "AdvancedBikeData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegalNotice" ADD CONSTRAINT "LegalNotice_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegalNotice" ADD CONSTRAINT "LegalNotice_bikeId_fkey" FOREIGN KEY ("bikeId") REFERENCES "Bike"("id") ON DELETE CASCADE ON UPDATE CASCADE;
