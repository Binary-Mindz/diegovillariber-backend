/*
  Warnings:

  - You are about to drop the `HighlightProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "HighlightProduct" DROP CONSTRAINT "HighlightProduct_productId_fkey";

-- AlterTable
ALTER TABLE "ProductList" ADD COLUMN     "highlightProduct" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "HighlightProduct";

-- DropEnum
DROP TYPE "HighlightStatus";
