-- CreateTable
CREATE TABLE "TaggedProfilePost" (
    "id" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaggedProfilePost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TaggedProfilePost_profileId_idx" ON "TaggedProfilePost"("profileId");

-- CreateIndex
CREATE INDEX "TaggedProfilePost_postId_idx" ON "TaggedProfilePost"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "TaggedProfilePost_postId_profileId_key" ON "TaggedProfilePost"("postId", "profileId");

-- AddForeignKey
ALTER TABLE "TaggedProfilePost" ADD CONSTRAINT "TaggedProfilePost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaggedProfilePost" ADD CONSTRAINT "TaggedProfilePost_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
