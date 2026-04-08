-- CreateEnum
CREATE TYPE "PostViewSource" AS ENUM ('FEED', 'PROFILE', 'SEARCH', 'HASHTAG', 'DETAIL', 'SHARE_LINK');

-- CreateEnum
CREATE TYPE "ViewerRelationType" AS ENUM ('SELF', 'FOLLOWER', 'NON_FOLLOWER');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "view" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "post_view_insights" (
    "id" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "viewerId" UUID,
    "source" "PostViewSource" NOT NULL DEFAULT 'DETAIL',
    "relationType" "ViewerRelationType" NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_view_insights_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "post_view_insights_postId_idx" ON "post_view_insights"("postId");

-- CreateIndex
CREATE INDEX "post_view_insights_postId_viewedAt_idx" ON "post_view_insights"("postId", "viewedAt");

-- CreateIndex
CREATE INDEX "post_view_insights_postId_source_idx" ON "post_view_insights"("postId", "source");

-- CreateIndex
CREATE INDEX "post_view_insights_postId_relationType_idx" ON "post_view_insights"("postId", "relationType");

-- AddForeignKey
ALTER TABLE "post_view_insights" ADD CONSTRAINT "post_view_insights_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_view_insights" ADD CONSTRAINT "post_view_insights_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
