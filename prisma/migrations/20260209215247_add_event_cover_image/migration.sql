/*
  Warnings:

  - Added the required column `coverImage` to the `Event` table without a default value. This is not possible if the table is not empty.

*/

ALTER TABLE "Event" ADD COLUMN "coverImage" TEXT;

UPDATE "Event"
SET "coverImage" = 'https://cdn.example.com/default-cover.jpg'
WHERE "coverImage" IS NULL;

ALTER TABLE "Event" ALTER COLUMN "coverImage" SET NOT NULL;