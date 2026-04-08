-- CreateEnum
CREATE TYPE "TutorialStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "Tutorial" (
    "id" UUID NOT NULL,
    "sectionCode" VARCHAR(100) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "videoUrl" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 1,
    "learnVersion" INTEGER NOT NULL DEFAULT 1,
    "status" "TutorialStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tutorial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tutorial_sectionCode_learnVersion_order_key" ON "Tutorial"("sectionCode", "learnVersion", "order");
