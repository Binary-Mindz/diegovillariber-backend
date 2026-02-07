/*
  Warnings:

  - The values [Photography] on the enum `ProductCategory` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `chargePerDay` on the `HighlightProduct` table. All the data in the column will be lost.
  - You are about to drop the column `buyProductId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the `BuyProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PaymentToProductList` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `chargeAmount` to the `HighlightProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `durationHours` to the `HighlightProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ProductList` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "HighlightStatus" AS ENUM ('PENDING', 'ACTIVE', 'EXPIRED', 'CANCELLED');

-- AlterEnum
BEGIN;
CREATE TYPE "ProductCategory_new" AS ENUM ('Car_Tyres', 'Car_Parts', 'Car_Accessories');
ALTER TABLE "public"."ProductList" ALTER COLUMN "category" DROP DEFAULT;
ALTER TABLE "ProductList" ALTER COLUMN "category" TYPE "ProductCategory_new" USING ("category"::text::"ProductCategory_new");
ALTER TYPE "ProductCategory" RENAME TO "ProductCategory_old";
ALTER TYPE "ProductCategory_new" RENAME TO "ProductCategory";
DROP TYPE "public"."ProductCategory_old";
ALTER TABLE "ProductList" ALTER COLUMN "category" SET DEFAULT 'Car_Parts';
COMMIT;

-- DropForeignKey
ALTER TABLE "BuyProduct" DROP CONSTRAINT "BuyProduct_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "BuyProduct" DROP CONSTRAINT "BuyProduct_productId_fkey";

-- DropForeignKey
ALTER TABLE "BuyProduct" DROP CONSTRAINT "BuyProduct_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "HighlightProduct" DROP CONSTRAINT "HighlightProduct_productId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_buyProductId_fkey";

-- DropForeignKey
ALTER TABLE "ProductList" DROP CONSTRAINT "ProductList_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "_PaymentToProductList" DROP CONSTRAINT "_PaymentToProductList_A_fkey";

-- DropForeignKey
ALTER TABLE "_PaymentToProductList" DROP CONSTRAINT "_PaymentToProductList_B_fkey";

-- AlterTable
ALTER TABLE "HighlightProduct" DROP COLUMN "chargePerDay",
ADD COLUMN     "chargeAmount" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "durationHours" INTEGER NOT NULL,
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "status" "HighlightStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "startDate" DROP NOT NULL,
ALTER COLUMN "endDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "buyProductId";

-- AlterTable
ALTER TABLE "ProductList" ADD COLUMN     "carBrand" TEXT,
ADD COLUMN     "carModel" TEXT,
ADD COLUMN     "productImage" TEXT,
ADD COLUMN     "showWhatsappNo" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "BuyProduct";

-- DropTable
DROP TABLE "_PaymentToProductList";

-- CreateIndex
CREATE INDEX "HighlightProduct_productId_idx" ON "HighlightProduct"("productId");

-- CreateIndex
CREATE INDEX "HighlightProduct_status_idx" ON "HighlightProduct"("status");

-- AddForeignKey
ALTER TABLE "HighlightProduct" ADD CONSTRAINT "HighlightProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ProductList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductList" ADD CONSTRAINT "ProductList_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
