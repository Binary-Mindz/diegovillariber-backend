-- AlterTable
ALTER TABLE "SpottingRequest" ADD COLUMN     "hashtags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "vehicleType" "PostAssetType",
ALTER COLUMN "radiusKm" SET DEFAULT 100;
