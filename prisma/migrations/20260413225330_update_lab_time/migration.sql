/*
  Warnings:

  - You are about to drop the column `carName` on the `LabTime` table. All the data in the column will be lost.
  - Added the required column `garageId` to the `LabTime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicleId` to the `LabTime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicleType` to the `LabTime` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LabVehicleType" AS ENUM ('CAR', 'BIKE');

-- AlterTable
ALTER TABLE "LabTime" DROP COLUMN "carName",
ADD COLUMN     "garageId" UUID NOT NULL,
ADD COLUMN     "latitude" DECIMAL(10,7),
ADD COLUMN     "longitude" DECIMAL(10,7),
ADD COLUMN     "vehicleId" UUID NOT NULL,
ADD COLUMN     "vehicleName" VARCHAR(255),
ADD COLUMN     "vehicleType" "LabVehicleType" NOT NULL;

-- CreateIndex
CREATE INDEX "LabTime_garageId_idx" ON "LabTime"("garageId");

-- CreateIndex
CREATE INDEX "LabTime_vehicleType_vehicleId_idx" ON "LabTime"("vehicleType", "vehicleId");

-- CreateIndex
CREATE INDEX "LabTime_trackName_trackLayout_lapTimeMs_idx" ON "LabTime"("trackName", "trackLayout", "lapTimeMs");

-- AddForeignKey
ALTER TABLE "LabTime" ADD CONSTRAINT "LabTime_garageId_fkey" FOREIGN KEY ("garageId") REFERENCES "Garage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
