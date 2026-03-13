-- CreateEnum
CREATE TYPE "AdStatus" AS ENUM ('ACTIVE', 'PAUSE');

-- CreateEnum
CREATE TYPE "BannerWidth" AS ENUM ('FULL_WIDTH', 'CONTAINED', 'NARROW', 'CUSTOM');

-- CreateEnum
CREATE TYPE "BannerHeight" AS ENUM ('AUTO_HEIGHT', 'SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE');

-- CreateEnum
CREATE TYPE "Placement" AS ENUM ('ALL', 'IOS', 'ANDROID', 'WEB');

-- CreateEnum
CREATE TYPE "LinkType" AS ENUM ('EXTERNAL_LINK', 'POST_LINK');

-- CreateTable
CREATE TABLE "Ad" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "link" "LinkType" NOT NULL DEFAULT 'EXTERNAL_LINK',
    "linkUrl" TEXT NOT NULL,
    "bannerUrl" TEXT,
    "localRatio" INTEGER,
    "nationRatio" INTEGER,
    "worldWide" TEXT,
    "targetUrl" TEXT,
    "altText" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "vehicleType" "Preference" NOT NULL DEFAULT 'CAR',
    "placement" "Placement" NOT NULL DEFAULT 'ALL',
    "minimumPoint" INTEGER,
    "maximumPoint" INTEGER,
    "cap" INTEGER,
    "dailyBudget" TEXT,
    "totalBudget" TEXT,
    "countryCode" TEXT,
    "languages" TEXT,
    "tags" TEXT,
    "spotter" BOOLEAN NOT NULL DEFAULT false,
    "proDriver" BOOLEAN NOT NULL DEFAULT false,
    "owner" BOOLEAN NOT NULL DEFAULT false,
    "proBussiness" BOOLEAN NOT NULL DEFAULT false,
    "contentCreator" BOOLEAN NOT NULL DEFAULT false,
    "simRacingDriver" BOOLEAN NOT NULL DEFAULT false,
    "enableAdGlobally" BOOLEAN NOT NULL DEFAULT false,
    "showAd" INTEGER,
    "maxAdPerPage" INTEGER,
    "rotationIntervel" INTEGER,
    "bannerWidth" "BannerWidth" NOT NULL DEFAULT 'FULL_WIDTH',
    "bannerHeight" "BannerHeight" NOT NULL DEFAULT 'AUTO_HEIGHT',
    "prioritize" BOOLEAN NOT NULL DEFAULT false,
    "autoPause" BOOLEAN NOT NULL DEFAULT false,
    "minimumCTR" INTEGER,
    "enableBannerAnimation" BOOLEAN NOT NULL DEFAULT false,
    "autoRotationEnabled" BOOLEAN NOT NULL DEFAULT false,
    "previewMode" BOOLEAN NOT NULL DEFAULT false,
    "showFeed" BOOLEAN NOT NULL DEFAULT false,
    "showProfile" BOOLEAN NOT NULL DEFAULT false,
    "showMarketPlace" BOOLEAN NOT NULL DEFAULT false,
    "showEvent" BOOLEAN NOT NULL DEFAULT false,
    "showChallenges" BOOLEAN NOT NULL DEFAULT false,
    "showBattle" BOOLEAN NOT NULL DEFAULT false,
    "adStatus" "AdStatus" NOT NULL DEFAULT 'PAUSE',

    CONSTRAINT "Ad_pkey" PRIMARY KEY ("id")
);
