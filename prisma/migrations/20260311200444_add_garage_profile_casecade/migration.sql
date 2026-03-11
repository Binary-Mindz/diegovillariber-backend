-- DropForeignKey
ALTER TABLE "Car" DROP CONSTRAINT "Car_garageId_fkey";

-- DropForeignKey
ALTER TABLE "Car" DROP CONSTRAINT "Car_profileId_fkey";

-- DropForeignKey
ALTER TABLE "Garage" DROP CONSTRAINT "Garage_profileId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_profileId_fkey";

-- DropForeignKey
ALTER TABLE "VirtualGarage" DROP CONSTRAINT "VirtualGarage_profileId_fkey";

-- DropForeignKey
ALTER TABLE "VirtualSimRacingEvent" DROP CONSTRAINT "VirtualSimRacingEvent_profileId_fkey";

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_garageId_fkey" FOREIGN KEY ("garageId") REFERENCES "Garage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Garage" ADD CONSTRAINT "Garage_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualGarage" ADD CONSTRAINT "VirtualGarage_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualSimRacingEvent" ADD CONSTRAINT "VirtualSimRacingEvent_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
