/*
  Warnings:

  - A unique constraint covering the columns `[selectHeader]` on the table `Header` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Header_headerName_key";

-- CreateIndex
CREATE UNIQUE INDEX "Header_selectHeader_key" ON "Header"("selectHeader");
