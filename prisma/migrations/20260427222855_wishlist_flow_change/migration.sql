/*
  Warnings:

  - You are about to drop the column `postId` on the `WishList` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `WishList` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productId` to the `WishList` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "WishList" DROP CONSTRAINT "WishList_postId_fkey";

-- DropIndex
DROP INDEX "WishList_userId_postId_key";

-- AlterTable
ALTER TABLE "ProductList" ADD COLUMN     "isWishListed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "WishList" DROP COLUMN "postId",
ADD COLUMN     "productId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "WishList_userId_key" ON "WishList"("userId");

-- AddForeignKey
ALTER TABLE "WishList" ADD CONSTRAINT "WishList_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ProductList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
