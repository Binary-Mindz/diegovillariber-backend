-- AlterTable
ALTER TABLE "Bike" ADD COLUMN     "bikeLocation" TEXT,
ADD COLUMN     "latitude" DECIMAL(9,6),
ADD COLUMN     "locationAddress" TEXT,
ADD COLUMN     "locationName" TEXT,
ADD COLUMN     "locationVisibility" TEXT,
ADD COLUMN     "longitude" DECIMAL(9,6),
ADD COLUMN     "placeId" TEXT;

-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "carLocation" TEXT,
ADD COLUMN     "latitude" DECIMAL(9,6),
ADD COLUMN     "locationAddress" TEXT,
ADD COLUMN     "locationName" TEXT,
ADD COLUMN     "locationVisibility" TEXT,
ADD COLUMN     "longitude" DECIMAL(9,6),
ADD COLUMN     "placeId" TEXT;
