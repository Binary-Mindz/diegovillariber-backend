-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isTwoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFactorOtp" TEXT,
ADD COLUMN     "twoFactorOtpExpiresAt" TIMESTAMP(3),
ADD COLUMN     "twoFactorTempToken" VARCHAR(500);
