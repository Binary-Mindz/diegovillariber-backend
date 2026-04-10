/*
  Warnings:

  - A unique constraint covering the columns `[carId]` on the table `ProductList` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ProductList" ADD COLUMN     "carId" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "ProductList_carId_key" ON "ProductList"("carId");

-- AddForeignKey
ALTER TABLE "ProductList" ADD CONSTRAINT "ProductList_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;
