/*
  Warnings:

  - You are about to drop the column `transmission` on the `Drivetrain` table. All the data in the column will be lost.
  - You are about to drop the column `tires` on the `EnginePower` table. All the data in the column will be lost.
  - You are about to drop the column `wheels` on the `EnginePower` table. All the data in the column will be lost.
  - You are about to drop the column `aeroParts` on the `TuningAero` table. All the data in the column will be lost.
  - You are about to drop the column `ecuType` on the `TuningAero` table. All the data in the column will be lost.
  - The `category` column on the `UsageNotes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `driverLevel` column on the `UsageNotes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `usageMode` column on the `UsageNotes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `wheelAlignmentFront` on the `WheelsTires` table. All the data in the column will be lost.
  - You are about to drop the column `wheelAlignmentRear` on the `WheelsTires` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Hydrogen', 'E85');

-- CreateEnum
CREATE TYPE "EcuTune" AS ENUM ('Stock', 'Stage_1', 'Stage_2', 'Stage_3', 'Custom');

-- CreateEnum
CREATE TYPE "UsageCategory" AS ENUM ('Street', 'Trackday', 'Race', 'Time_Attack', 'Drift', 'Show');

-- CreateEnum
CREATE TYPE "DriverLevel" AS ENUM ('Amateur', 'Semi_Pro', 'Pro');

-- CreateEnum
CREATE TYPE "UsageMode" AS ENUM ('Daily', 'Weekend', 'Track_Only', 'Show_Only');

-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "country" TEXT,
ADD COLUMN     "listOnMarketplace" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Drivetrain" DROP COLUMN "transmission",
ADD COLUMN     "transmissionMods" TEXT;

-- AlterTable
ALTER TABLE "EnginePower" DROP COLUMN "tires",
DROP COLUMN "wheels",
ADD COLUMN     "coolingUpgrades" TEXT,
ADD COLUMN     "dynoWeightKg" INTEGER,
ADD COLUMN     "engineDescription" TEXT,
ADD COLUMN     "exhaustSystem" TEXT,
ADD COLUMN     "fuelSystemMods" TEXT,
ADD COLUMN     "fuelType" "FuelType" NOT NULL DEFAULT 'Gasoline',
ADD COLUMN     "horsepowerHp" INTEGER,
ADD COLUMN     "intakeSystem" TEXT,
ADD COLUMN     "intercooler" TEXT,
ADD COLUMN     "rpmLimiter" INTEGER,
ADD COLUMN     "torqueNm" INTEGER,
ADD COLUMN     "turboOrSupercharger" TEXT,
ADD COLUMN     "weightKg" INTEGER;

-- AlterTable
ALTER TABLE "TuningAero" DROP COLUMN "aeroParts",
DROP COLUMN "ecuType",
ADD COLUMN     "aeroDynamics" TEXT,
ADD COLUMN     "ecuTune" "EcuTune" NOT NULL DEFAULT 'Stock';

-- AlterTable
ALTER TABLE "UsageNotes" DROP COLUMN "category",
ADD COLUMN     "category" "UsageCategory" NOT NULL DEFAULT 'Street',
DROP COLUMN "driverLevel",
ADD COLUMN     "driverLevel" "DriverLevel" NOT NULL DEFAULT 'Amateur',
DROP COLUMN "usageMode",
ADD COLUMN     "usageMode" "UsageMode" NOT NULL DEFAULT 'Daily';

-- AlterTable
ALTER TABLE "WheelsTires" DROP COLUMN "wheelAlignmentFront",
DROP COLUMN "wheelAlignmentRear",
ADD COLUMN     "frontCamber" DOUBLE PRECISION,
ADD COLUMN     "rearCamber" DOUBLE PRECISION,
ADD COLUMN     "tires" TEXT,
ADD COLUMN     "wheels" TEXT;
