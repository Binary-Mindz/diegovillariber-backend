-- CreateEnum
CREATE TYPE "HeaderName" AS ENUM ('CHALLEGE', 'RAW_SHIFT', 'MOTOR_SPORT_RANKING');

-- CreateTable
CREATE TABLE "Header" (
    "id" TEXT NOT NULL,
    "selectHeader" "HeaderName" NOT NULL DEFAULT 'CHALLEGE',
    "headerName" TEXT NOT NULL,
    "brandName" TEXT,
    "bannerImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Header_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Header_headerName_key" ON "Header"("headerName");
