/*
  Warnings:

  - You are about to drop the column `profileType` on the `Profile` table. All the data in the column will be lost.
  - Added the required column `profileType` to the `ProDriverProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Profile_userId_profileType_key";

-- AlterTable
ALTER TABLE "BusinessProfile" ADD COLUMN     "profileType" "Type" NOT NULL DEFAULT 'PRO_BUSSINESS';

-- AlterTable
ALTER TABLE "ContentCreatorProfile" ADD COLUMN     "profileType" "Type" NOT NULL DEFAULT 'CONTENT_CREATOR';

-- AlterTable
ALTER TABLE "OwnerProfile" ADD COLUMN     "profileType" "Type" NOT NULL DEFAULT 'OWNER';

-- AlterTable
ALTER TABLE "ProDriverProfile" ADD COLUMN     "profileType" "Type" NOT NULL;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "profileType";

-- AlterTable
ALTER TABLE "SimRacingProfile" ADD COLUMN     "profileType" "Type" NOT NULL DEFAULT 'SIM_RACING_DRIVER';

-- AlterTable
ALTER TABLE "SpotterProfile" ADD COLUMN     "profileType" "Type" NOT NULL DEFAULT 'SPOTTER';
