-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "latitude" DECIMAL(9,6),
ADD COLUMN     "locationAddress" TEXT,
ADD COLUMN     "locationName" TEXT,
ADD COLUMN     "longitude" DECIMAL(9,6),
ADD COLUMN     "placeId" TEXT;
