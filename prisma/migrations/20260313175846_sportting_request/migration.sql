-- CreateEnum
CREATE TYPE "SpottingRequestStatus" AS ENUM ('ACTIVE', 'PAUSED', 'MATCHED', 'EXPIRED', 'CANCELLED');

-- CreateTable
CREATE TABLE "SpottingMatch" (
    "id" UUID NOT NULL,
    "spottingRequestId" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "spottedUserId" UUID NOT NULL,
    "distanceKm" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpottingMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpottingRequest" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "profileId" UUID,
    "carId" UUID,
    "title" VARCHAR(150),
    "brand" VARCHAR(100),
    "model" VARCHAR(100),
    "latitude" DECIMAL(9,6) NOT NULL,
    "longitude" DECIMAL(9,6) NOT NULL,
    "radiusKm" INTEGER NOT NULL DEFAULT 50,
    "status" "SpottingRequestStatus" NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" TIMESTAMP(3),
    "lastMatchedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpottingRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBlock" (
    "id" UUID NOT NULL,
    "blockerId" UUID NOT NULL,
    "blockedUserId" UUID NOT NULL,
    "reason" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserBlock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SpottingMatch_spottingRequestId_idx" ON "SpottingMatch"("spottingRequestId");

-- CreateIndex
CREATE INDEX "SpottingMatch_postId_idx" ON "SpottingMatch"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "SpottingMatch_spottingRequestId_postId_key" ON "SpottingMatch"("spottingRequestId", "postId");

-- CreateIndex
CREATE INDEX "SpottingRequest_userId_idx" ON "SpottingRequest"("userId");

-- CreateIndex
CREATE INDEX "SpottingRequest_status_idx" ON "SpottingRequest"("status");

-- CreateIndex
CREATE INDEX "SpottingRequest_brand_model_idx" ON "SpottingRequest"("brand", "model");

-- CreateIndex
CREATE INDEX "UserBlock_blockerId_idx" ON "UserBlock"("blockerId");

-- CreateIndex
CREATE INDEX "UserBlock_blockedUserId_idx" ON "UserBlock"("blockedUserId");

-- CreateIndex
CREATE UNIQUE INDEX "UserBlock_blockerId_blockedUserId_key" ON "UserBlock"("blockerId", "blockedUserId");

-- AddForeignKey
ALTER TABLE "SpottingMatch" ADD CONSTRAINT "SpottingMatch_spottingRequestId_fkey" FOREIGN KEY ("spottingRequestId") REFERENCES "SpottingRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpottingMatch" ADD CONSTRAINT "SpottingMatch_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpottingMatch" ADD CONSTRAINT "SpottingMatch_spottedUserId_fkey" FOREIGN KEY ("spottedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpottingRequest" ADD CONSTRAINT "SpottingRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpottingRequest" ADD CONSTRAINT "SpottingRequest_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpottingRequest" ADD CONSTRAINT "SpottingRequest_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBlock" ADD CONSTRAINT "UserBlock_blockerId_fkey" FOREIGN KEY ("blockerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBlock" ADD CONSTRAINT "UserBlock_blockedUserId_fkey" FOREIGN KEY ("blockedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
