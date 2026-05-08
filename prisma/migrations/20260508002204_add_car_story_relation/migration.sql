/*
  Warnings:

  - A unique constraint covering the columns `[carId]` on the table `CarStory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `carId` to the `CarStory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CarStory" ADD COLUMN     "carId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CarStory_carId_key" ON "CarStory"("carId");

-- AddForeignKey
ALTER TABLE "CarStory" ADD CONSTRAINT "CarStory_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;
