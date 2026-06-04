/*
  Warnings:

  - Added the required column `reason` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('NOT_LIKED', 'COPYRIGHT', 'FALSE_INFORMATION', 'SCAM_FRAUD_SPAM', 'VIOLENCE_HATE_EXPLOITATION', 'NUDITY_SEXUAL_ACTIVITY', 'SUICIDE_OR_EATING_DISORDERS', 'RESTRICTED_ITEMS');

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "reason" "ReportReason" NOT NULL;
