-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "latitude" DECIMAL(9,6),
ADD COLUMN     "locationAddress" TEXT,
ADD COLUMN     "longitude" DECIMAL(9,6),
ADD COLUMN     "placeId" TEXT;
