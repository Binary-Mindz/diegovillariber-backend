/*
  Warnings:

  - You are about to drop the column `accessToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "accessToken",
DROP COLUMN "refreshToken",
ADD COLUMN     "emailOtp" TEXT,
ADD COLUMN     "emailOtpExpiresAt" TIMESTAMP(3),
ADD COLUMN     "refreshTokenHash" TEXT,
ADD COLUMN     "resetOtp" TEXT,
ADD COLUMN     "resetOtpExpiresAt" TIMESTAMP(3),
ALTER COLUMN "isEmailVerified" SET DEFAULT false;
