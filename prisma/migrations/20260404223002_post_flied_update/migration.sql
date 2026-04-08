-- CreateEnum
CREATE TYPE "PostAssetType" AS ENUM ('CAR', 'BIKE');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "assetType" "PostAssetType" DEFAULT 'CAR',
ADD COLUMN     "bikeId" UUID;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_bikeId_fkey" FOREIGN KEY ("bikeId") REFERENCES "Bike"("id") ON DELETE SET NULL ON UPDATE CASCADE;
