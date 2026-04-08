-- DropForeignKey
ALTER TABLE "BusinessProfile" DROP CONSTRAINT "BusinessProfile_profileId_fkey";

-- DropForeignKey
ALTER TABLE "ContentCreatorProfile" DROP CONSTRAINT "ContentCreatorProfile_profileId_fkey";

-- DropForeignKey
ALTER TABLE "OwnerProfile" DROP CONSTRAINT "OwnerProfile_profileId_fkey";

-- DropForeignKey
ALTER TABLE "ProDriverProfile" DROP CONSTRAINT "ProDriverProfile_profileId_fkey";

-- DropForeignKey
ALTER TABLE "SimRacingProfile" DROP CONSTRAINT "SimRacingProfile_profileId_fkey";

-- DropForeignKey
ALTER TABLE "SpotterProfile" DROP CONSTRAINT "SpotterProfile_profileId_fkey";

-- AddForeignKey
ALTER TABLE "BusinessProfile" ADD CONSTRAINT "BusinessProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentCreatorProfile" ADD CONSTRAINT "ContentCreatorProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnerProfile" ADD CONSTRAINT "OwnerProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProDriverProfile" ADD CONSTRAINT "ProDriverProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimRacingProfile" ADD CONSTRAINT "SimRacingProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpotterProfile" ADD CONSTRAINT "SpotterProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
