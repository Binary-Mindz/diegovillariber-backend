-- CreateEnum
CREATE TYPE "PostTagRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "PostTagRequest" (
    "id" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "taggedUserId" UUID NOT NULL,
    "status" "PostTagRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "PostTagRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PostTagRequest_taggedUserId_status_idx" ON "PostTagRequest"("taggedUserId", "status");

-- CreateIndex
CREATE INDEX "PostTagRequest_postId_idx" ON "PostTagRequest"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "PostTagRequest_postId_taggedUserId_key" ON "PostTagRequest"("postId", "taggedUserId");

-- AddForeignKey
ALTER TABLE "PostTagRequest" ADD CONSTRAINT "PostTagRequest_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostTagRequest" ADD CONSTRAINT "PostTagRequest_taggedUserId_fkey" FOREIGN KEY ("taggedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
