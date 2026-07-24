-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'EUR', 'GBP');

-- AlterTable
ALTER TABLE "Bike" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'EUR';

-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'EUR';
