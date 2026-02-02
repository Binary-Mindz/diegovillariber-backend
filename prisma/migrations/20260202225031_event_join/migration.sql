/*
  Warnings:

  - You are about to drop the column `availableTicket` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `ticketId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the `EventTicket` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EventTicket" DROP CONSTRAINT "EventTicket_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "EventTicket" DROP CONSTRAINT "EventTicket_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventTicket" DROP CONSTRAINT "EventTicket_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_ticketId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "availableTicket",
ADD COLUMN     "joinedCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "maxParticipants" INTEGER NOT NULL DEFAULT 50;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "ticketId";

-- DropTable
DROP TABLE "EventTicket";

-- CreateTable
CREATE TABLE "EventParticipant" (
    "id" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventParticipant_eventId_userId_key" ON "EventParticipant"("eventId", "userId");

-- AddForeignKey
ALTER TABLE "EventParticipant" ADD CONSTRAINT "EventParticipant_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventParticipant" ADD CONSTRAINT "EventParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
