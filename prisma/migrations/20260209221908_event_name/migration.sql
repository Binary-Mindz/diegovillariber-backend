/*
  Warnings:

  - You are about to drop the column `joinedCount` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `maxParticipants` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the `EventParticipant` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `price` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EventParticipant" DROP CONSTRAINT "EventParticipant_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventParticipant" DROP CONSTRAINT "EventParticipant_userId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "joinedCount",
DROP COLUMN "maxParticipants",
ADD COLUMN     "price" INTEGER NOT NULL;

-- DropTable
DROP TABLE "EventParticipant";
