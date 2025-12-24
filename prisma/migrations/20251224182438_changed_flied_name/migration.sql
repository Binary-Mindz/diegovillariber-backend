/*
  Warnings:

  - You are about to drop the column `additional_info` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profile_picture` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `zip_code` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "additional_info",
DROP COLUMN "created_at",
DROP COLUMN "first_name",
DROP COLUMN "last_name",
DROP COLUMN "profile_picture",
DROP COLUMN "updated_at",
DROP COLUMN "zip_code",
ADD COLUMN     "additionalInfo" VARCHAR(255),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "firstName" VARCHAR(100) NOT NULL,
ADD COLUMN     "lastName" VARCHAR(100) NOT NULL,
ADD COLUMN     "profilePicture" VARCHAR(255),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "zipCode" VARCHAR(10) NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" DEFAULT 'USER';

-- DropEnum
DROP TYPE "role";
