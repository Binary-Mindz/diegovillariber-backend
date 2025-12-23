-- CreateEnum
CREATE TYPE "role" AS ENUM ('User', 'Admin');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "role" DEFAULT 'User';
