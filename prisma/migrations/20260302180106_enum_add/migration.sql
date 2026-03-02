/*
  Warnings:

  - The `steeringWheel` column on the `HardwareSetup` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `wheelModel` column on the `HardwareSetup` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `wheelbase` column on the `HardwareSetup` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "SteeringWheel" AS ENUM ('FANATEC', 'THRUSTMASTER', 'SIMUCUBE', 'MOZA_RACING', 'ASETEK_SIM_SPORTS', 'SIMAGIC', 'CAMMUS', 'VRS_DIRECT_FORCE', 'ACCUFORCE', 'AUGURY', 'OTHER');

-- CreateEnum
CREATE TYPE "WheelModel" AS ENUM ('FANATEC', 'LOGITECH', 'THRUSTMASTER', 'HEUSINKVELD', 'SIMUCUBE', 'MOZA_RACING', 'ASETEK_SIM_SPORTS', 'SIMAGIC', 'WAVE_ITALY', 'OTHER');

-- CreateEnum
CREATE TYPE "WheelBase" AS ENUM ('DESK_MOUNT', 'WHEEL_STAND', 'COCKPIT', 'FULL_MOTION', 'RIG', 'DIY_RIG');

-- AlterTable
ALTER TABLE "HardwareSetup" DROP COLUMN "steeringWheel",
ADD COLUMN     "steeringWheel" "SteeringWheel" NOT NULL DEFAULT 'FANATEC',
DROP COLUMN "wheelModel",
ADD COLUMN     "wheelModel" "WheelModel" NOT NULL DEFAULT 'LOGITECH',
DROP COLUMN "wheelbase",
ADD COLUMN     "wheelbase" "WheelBase" NOT NULL DEFAULT 'DESK_MOUNT';
