-- CreateEnum
CREATE TYPE "OfficialPartnerRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AmbassadorStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "isEmailVerified" SET DEFAULT true;

-- CreateTable
CREATE TABLE "AmbassadorProgram" (
    "id" TEXT NOT NULL,
    "ambassadorRequestUserId" TEXT NOT NULL,
    "requestStatus" "AmbassadorStatus" NOT NULL DEFAULT 'PENDING',
    "motorspotName" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "instagramProfile" TEXT,
    "tiktokProfile" TEXT,
    "youTubeChanel" TEXT,
    "totalFollower" INTEGER NOT NULL,
    "mainCar" TEXT,
    "whyDoYouWant" TEXT NOT NULL,
    "releventExperience" TEXT,
    "profilePhoto" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AmbassadorProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfficialPartner" (
    "id" TEXT NOT NULL,
    "requestUserId" TEXT NOT NULL,
    "requestStatus" "OfficialPartnerRequestStatus" NOT NULL DEFAULT 'PENDING',
    "brandLogo" TEXT,
    "brandName" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "brandDescription" TEXT,
    "websiteUrl" TEXT,
    "industry" TEXT,
    "country" TEXT,
    "companyRegistrationNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OfficialPartner_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AmbassadorProgram" ADD CONSTRAINT "AmbassadorProgram_ambassadorRequestUserId_fkey" FOREIGN KEY ("ambassadorRequestUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfficialPartner" ADD CONSTRAINT "OfficialPartner_requestUserId_fkey" FOREIGN KEY ("requestUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
