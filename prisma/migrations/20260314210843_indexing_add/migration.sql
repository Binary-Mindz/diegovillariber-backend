-- DropIndex
DROP INDEX "HeadToHeadBattle_status_idx";

-- CreateIndex
CREATE INDEX "Challenge_latitude_longitude_idx" ON "Challenge"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "Challenge_participationScope_idx" ON "Challenge"("participationScope");

-- CreateIndex
CREATE INDEX "Challenge_startDate_endDate_idx" ON "Challenge"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "HeadToHeadBattle_latitude_longitude_idx" ON "HeadToHeadBattle"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "HeadToHeadBattle_status_participationScope_idx" ON "HeadToHeadBattle"("status", "participationScope");

-- CreateIndex
CREATE INDEX "HeadToHeadBattle_startDate_endDate_idx" ON "HeadToHeadBattle"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "Post_profileType_idx" ON "Post"("profileType");

-- CreateIndex
CREATE INDEX "Post_latitude_longitude_idx" ON "Post"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "Post_ratingAverage_idx" ON "Post"("ratingAverage");

-- CreateIndex
CREATE INDEX "Post_createdAt_idx" ON "Post"("createdAt");
