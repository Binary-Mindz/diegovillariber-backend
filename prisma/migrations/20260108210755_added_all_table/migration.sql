/*
  Warnings:

  - The values [USER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `additionalInfo` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `otpExpiresAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `User` table. All the data in the column will be lost.
  - Changed the type of `id` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `role` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Preference" AS ENUM ('Car', 'Motorbike', 'Both');

-- CreateEnum
CREATE TYPE "Type" AS ENUM ('SPOTTER', 'OWNER', 'CONTENT_CREATOR', 'PRO_BUSSINESS', 'PRO_DRIVER', 'SIM_RACING_DRIVER');

-- CreateEnum
CREATE TYPE "IsActive" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "Media" AS ENUM ('PHOTO', 'VIDEO');

-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('Spotter_Post', 'Owner_Post', 'Battle_Post', 'Challenge_Post');

-- CreateEnum
CREATE TYPE "BattleStatus" AS ENUM ('PENDING', 'ONGOING', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "BattleType" AS ENUM ('OPEN_BATTLE', 'INVITATION_ONLY', 'SEND_INVITATION_AUTO', 'HEAD_TO_HEAD');

-- CreateEnum
CREATE TYPE "PointType" AS ENUM ('BATTLE_WIN', 'POST', 'LIKE', 'COMMENT', 'ONGOING');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "BuyStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESSED', 'CANCELL');

-- CreateEnum
CREATE TYPE "LiveStatus" AS ENUM ('CREATED', 'SCHEDULED', 'LIVE', 'PAUSED', 'ENDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "ContentCategory" AS ENUM ('PHOTOGRAPHY', 'VLOG', 'ANALYSIS');

-- CreateEnum
CREATE TYPE "RacingType" AS ENUM ('GT_Racing', 'Rally', 'MotoGP', 'Formula_Racing', 'Drift', 'Karting', 'Endurance_Racing');

-- CreateEnum
CREATE TYPE "BusinessCategory" AS ENUM ('Detailling_Care', 'Parts_Performance', 'Ecu_Dyno_Tuning', 'Wrap_Vinyl', 'Motorsport_Service', 'Event_Promoter', 'Media_Podcast', 'Dealership', 'Body_Coachbuilder', 'Auto_Recycling', 'Inspection_Technical');

-- CreateEnum
CREATE TYPE "BodyType" AS ENUM ('Coupe', 'Sedan', 'Hatchback', 'Convertible', 'SUV', 'Wagon', 'Pickup', 'Van');

-- CreateEnum
CREATE TYPE "Transmission" AS ENUM ('Manual', 'Automatic', 'Sequential', 'DCT', 'CVT');

-- CreateEnum
CREATE TYPE "DriveTrain" AS ENUM ('RWD', 'FWD', 'AWD', 'FOUR_WD');

-- CreateEnum
CREATE TYPE "DriveCategory" AS ENUM ('Daily_Drive', 'Weekend_Warrior', 'Track_Tool', 'Show_Car', 'Project_Car');

-- CreateEnum
CREATE TYPE "TrackCondition" AS ENUM ('Dry', 'Damp', 'Wet', 'Dusty', 'Greasy');

-- CreateEnum
CREATE TYPE "Weather" AS ENUM ('Sunny', 'Cloudy', 'Overcast', 'Light_Rain', 'Heavy_Rain', 'Mixed');

-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('Track_Day', 'Private_Session', 'Race_Weekend', 'Test_Day', 'Time_Attack_Event');

-- CreateEnum
CREATE TYPE "TireCompound" AS ENUM ('Slick', 'Semi_Slick', 'Street', 'All_Season', 'Rain');

-- CreateEnum
CREATE TYPE "DriveStyle" AS ENUM ('Conservative_Leaving_Margin', 'Moderate_Balanced_Approach', 'Aggressive_Pushing_Hard', 'At_The_Limit_Full_Send');

-- CreateEnum
CREATE TYPE "CarFound" AS ENUM ('Auction', 'Dealer', 'Private_Seller', 'Online_Marketplace', 'Family', 'Friend', 'Barn_Find', 'Other');

-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('iRacing', 'Assetto_Corsa_Competizione', 'Gran_Turismo_7', 'Forza_Motorsport', 'F1_24', 'rFactor_2', 'Automobilista_2', 'RaceRoom', 'Project_CARS_2', 'BeamNG_drive', 'Other');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('Public', 'Private', 'Friend', 'Only_Me');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('Race', 'League_Race', 'Hot_Lap_Session', 'Practice_Session', 'Endurance_Race', 'Time_Attack', 'Drift_Session', 'Other');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('POST', 'PROFILE');

-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('Car_Parts', 'Photography');

-- CreateEnum
CREATE TYPE "CarClass" AS ENUM ('GT3', 'GT4', 'GTE', 'LMP2', 'F124', 'LMP1', 'FORMULA_1', 'FORMULA_2', 'FORMULA_3', 'TOURING_CAR', 'STOCK_CAR', 'RALLY', 'DRIFT', 'ROAD_CAR', 'PROTOTYPE', 'VINTAGE', 'OTHER');

-- CreateEnum
CREATE TYPE "TelemetrySource" AS ENUM ('iRacing_MoTec', 'ACC_Mo_Tec', 'SimHub', 'Crew_Chief', 'Z1_Dashboard', 'Racelab', 'Kapps', 'Other');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('User', 'ADMIN', 'SUPER_ADMIN');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'User';
COMMIT;

-- DropIndex
DROP INDEX "User_phone_key";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "additionalInfo",
DROP COLUMN "location",
DROP COLUMN "otpExpiresAt",
DROP COLUMN "profilePicture",
DROP COLUMN "zipCode",
ADD COLUMN     "accessToken" TEXT,
ADD COLUMN     "balance" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "commentCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "expiresIn" TEXT,
ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "shareCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalPoints" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "firstName" DROP NOT NULL,
ALTER COLUMN "firstName" SET DATA TYPE TEXT,
ALTER COLUMN "lastName" DROP NOT NULL,
ALTER COLUMN "lastName" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "phone" SET DATA TYPE TEXT,
ALTER COLUMN "password" SET DATA TYPE TEXT,
ALTER COLUMN "role" SET NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'User',
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "AdvancedCarData" (
    "id" UUID NOT NULL,
    "carId" UUID NOT NULL,

    CONSTRAINT "AdvancedCarData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Battle" (
    "id" UUID NOT NULL,
    "hostId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT,
    "battleCategory" TEXT NOT NULL,
    "brand" TEXT,
    "car" TEXT,
    "battleType" "BattleType" NOT NULL DEFAULT 'HEAD_TO_HEAD',
    "status" "BattleStatus" NOT NULL DEFAULT 'PENDING',
    "maxParticipants" INTEGER NOT NULL DEFAULT 10,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "isActive" "IsActive" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Battle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BattleEntry" (
    "id" UUID NOT NULL,
    "battleId" UUID,
    "participantId" UUID NOT NULL,
    "postType" "PostType" NOT NULL DEFAULT 'Battle_Post',
    "mediaUrl" "Media" NOT NULL DEFAULT 'PHOTO',
    "caption" TEXT,
    "hashtag" TEXT,
    "like" INTEGER NOT NULL DEFAULT 0,
    "comment" INTEGER NOT NULL DEFAULT 0,
    "share" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "BattleEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BattleParticipant" (
    "id" UUID NOT NULL,
    "battleId" UUID NOT NULL,
    "particepantId" UUID NOT NULL,
    "joinedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "BattleParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BattleResult" (
    "id" UUID NOT NULL,
    "battleId" UUID NOT NULL,
    "winnerUserId" UUID NOT NULL,
    "rewardPoints" INTEGER NOT NULL DEFAULT 250,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BattleResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BattleVote" (
    "id" UUID NOT NULL,
    "battleId" UUID NOT NULL,
    "participantId" UUID NOT NULL,
    "voterUserId" UUID NOT NULL,
    "votedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BattleVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessProfile" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "businessCategory" "BusinessCategory" NOT NULL DEFAULT 'Detailling_Care',
    "businessName" TEXT NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "BusinessProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuyProduct" (
    "id" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "sellerId" UUID NOT NULL,
    "buyerId" UUID NOT NULL,
    "status" "BuyStatus" NOT NULL DEFAULT 'PENDING',
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "BuyProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Car" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "garageId" UUID NOT NULL,
    "image" TEXT,
    "make" TEXT,
    "model" TEXT,
    "bodyType" "BodyType" NOT NULL DEFAULT 'Coupe',
    "transmission" "Transmission" NOT NULL DEFAULT 'Manual',
    "driveTrain" "DriveTrain" NOT NULL DEFAULT 'RWD',
    "color" TEXT,
    "displayName" TEXT,
    "description" TEXT,
    "category" "DriveCategory" NOT NULL DEFAULT 'Daily_Drive',
    "price" INTEGER,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Challenge" (
    "id" UUID NOT NULL,
    "hostId" UUID NOT NULL,
    "participantsId" UUID,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "images" TEXT,
    "media" "Media" NOT NULL DEFAULT 'PHOTO',
    "camera" TEXT,
    "participants" INTEGER NOT NULL DEFAULT 10,
    "comment" TEXT,
    "isActive" "IsActive" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChallengeParticipant" (
    "id" UUID NOT NULL,
    "challengeId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "joinedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ChallengeParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChallengeResult" (
    "id" UUID NOT NULL,
    "challengeId" UUID NOT NULL,
    "winnerUserId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChallengeResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChassisBrakes" (
    "id" UUID NOT NULL,
    "advancedCarDataId" UUID NOT NULL,
    "suspension" TEXT,
    "brakes" TEXT,
    "rollCage" TEXT,

    CONSTRAINT "ChassisBrakes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "postType" "PostType" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentCreatorProfile" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "creatorCategory" "ContentCategory" NOT NULL DEFAULT 'PHOTOGRAPHY',
    "youtubeChanel" TEXT,
    "portfolioWebsite" TEXT,

    CONSTRAINT "ContentCreatorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DisplayAndPcSetup" (
    "id" UUID NOT NULL,
    "simRacingId" UUID NOT NULL,
    "monitors" TEXT,
    "vrHeadset" TEXT,
    "pcSpace" TEXT,

    CONSTRAINT "DisplayAndPcSetup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Drivetrain" (
    "id" UUID NOT NULL,
    "advancedCarDataId" UUID NOT NULL,
    "transmission" TEXT,
    "differential" TEXT,
    "clutch" TEXT,

    CONSTRAINT "Drivetrain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DrivingAssistant" (
    "id" UUID NOT NULL,
    "simRacingId" UUID NOT NULL,
    "tractionControl" BOOLEAN NOT NULL DEFAULT true,
    "abs" BOOLEAN NOT NULL DEFAULT false,
    "stability" BOOLEAN NOT NULL DEFAULT false,
    "autoClutch" BOOLEAN NOT NULL DEFAULT true,
    "racingLine" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DrivingAssistant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnginePower" (
    "id" UUID NOT NULL,
    "advancedCarDataId" UUID NOT NULL,
    "tires" TEXT,
    "wheels" TEXT,

    CONSTRAINT "EnginePower_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" UUID NOT NULL,
    "ownerId" UUID NOT NULL,
    "eventTitle" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "availableTicket" INTEGER NOT NULL DEFAULT 50,
    "eventType" "EventType" NOT NULL DEFAULT 'Race',
    "eventStatus" "EventStatus" NOT NULL DEFAULT 'PENDING',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventTicket" (
    "id" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "buyerId" UUID NOT NULL,
    "sellerId" UUID NOT NULL,
    "price" INTEGER NOT NULL,
    "status" "BuyStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follow" (
    "id" UUID NOT NULL,
    "followerId" UUID NOT NULL,
    "followingId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Garage" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "garageName" TEXT,
    "description" TEXT,
    "location" TEXT,

    CONSTRAINT "Garage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HardwareSetup" (
    "id" UUID NOT NULL,
    "simRacingId" UUID NOT NULL,
    "steeringWheel" TEXT,
    "wheelModel" TEXT,
    "wheelbase" TEXT,
    "pedals" TEXT,
    "pedelModel" TEXT,
    "shifter" TEXT,
    "handbrake" TEXT,
    "rig" TEXT,
    "rigBrand" TEXT,
    "seatBrand" TEXT,
    "buttonBox" TEXT,
    "bassShakers" BOOLEAN NOT NULL DEFAULT true,
    "windSim" BOOLEAN NOT NULL DEFAULT false,
    "racingGloves" BOOLEAN NOT NULL DEFAULT false,
    "racingShoes" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "HardwareSetup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hashtag" (
    "id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "Hashtag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HidePost" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HidePost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HighlightProduct" (
    "id" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "chargePerDay" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HighlightProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InteriorSafety" (
    "id" UUID NOT NULL,
    "advancedCarDataId" UUID NOT NULL,
    "seats" TEXT,
    "harness" TEXT,

    CONSTRAINT "InteriorSafety_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegalNotice" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "carId" UUID NOT NULL,
    "location" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "media" TEXT,
    "witnessName" TEXT,
    "witnessEmail" TEXT,
    "witnessPhone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LegalNotice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Like" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "postType" "PostType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Live" (
    "id" UUID NOT NULL,
    "hostId" UUID NOT NULL,
    "thumbnail" TEXT,
    "title" TEXT NOT NULL,
    "location" TEXT,
    "allowCameraAccess" BOOLEAN NOT NULL DEFAULT false,
    "allowAudioAccess" BOOLEAN NOT NULL DEFAULT false,
    "status" "LiveStatus" NOT NULL DEFAULT 'CREATED',
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "durationInMinutes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Live_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiveParticipant" (
    "id" UUID NOT NULL,
    "liveId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "LiveParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiveReward" (
    "id" UUID NOT NULL,
    "liveId" UUID NOT NULL,
    "hostId" UUID NOT NULL,
    "participantId" UUID NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LiveReward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" UUID NOT NULL,
    "senderId" UUID NOT NULL,
    "receiverId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OwnerProfile" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,

    CONSTRAINT "OwnerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "ticketId" UUID NOT NULL,
    "buyProductId" UUID,
    "amount" INTEGER NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "postType" "PostType" NOT NULL DEFAULT 'Spotter_Post',
    "caption" TEXT,
    "media" "Media" NOT NULL DEFAULT 'PHOTO',
    "like" INTEGER NOT NULL DEFAULT 0,
    "comment" INTEGER NOT NULL DEFAULT 0,
    "share" INTEGER NOT NULL DEFAULT 0,
    "contentBooster" BOOLEAN NOT NULL DEFAULT false,
    "point" INTEGER NOT NULL DEFAULT 300,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProDriverProfile" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "racingDiscipline" "RacingType" NOT NULL DEFAULT 'GT_Racing',
    "location" TEXT NOT NULL,

    CONSTRAINT "ProDriverProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductList" (
    "id" UUID NOT NULL,
    "ownerId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "ProductCategory" NOT NULL DEFAULT 'Car_Parts',
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "userName" TEXT,
    "bio" TEXT,
    "imageUrl" TEXT,
    "instagramHandler" TEXT,
    "accountType" "AccountType" NOT NULL DEFAULT 'PUBLIC',
    "preference" "Preference",
    "profileType" "Type" NOT NULL,
    "isActive" "IsActive" NOT NULL DEFAULT 'ACTIVE',
    "suspend" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Racing" (
    "id" UUID NOT NULL,
    "simRacingId" UUID NOT NULL,
    "iRacingId" TEXT,
    "accId" TEXT,
    "steamId" TEXT,
    "psnId" TEXT,
    "xboxGamertag" TEXT,

    CONSTRAINT "Racing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RacingVote" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "point" INTEGER NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RacingVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "targetType" "ReportType" NOT NULL,
    "targetId" UUID NOT NULL,
    "description" TEXT,
    "media" "Media" NOT NULL DEFAULT 'PHOTO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Repost" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "point" INTEGER NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Repost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavePost" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavePost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SetupDescriptionPhoto" (
    "id" UUID NOT NULL,
    "simRacingId" UUID NOT NULL,
    "setupDescription" TEXT,
    "setupPhoto" TEXT,

    CONSTRAINT "SetupDescriptionPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Share" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "postType" "PostType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Share_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SimRacingProfile" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SimRacingProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpotterProfile" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,

    CONSTRAINT "SpotterProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TuningAero" (
    "id" UUID NOT NULL,
    "advancedCarDataId" UUID NOT NULL,
    "ecuType" TEXT,
    "aeroParts" TEXT,

    CONSTRAINT "TuningAero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsageNotes" (
    "id" UUID NOT NULL,
    "advancedCarDataId" UUID NOT NULL,
    "category" TEXT,
    "driverLevel" TEXT,
    "usageMode" TEXT,
    "alignmentNotes" TEXT,

    CONSTRAINT "UsageNotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPoint" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "postId" UUID,
    "likeId" UUID,
    "commentId" UUID,
    "battleId" UUID NOT NULL,
    "points" INTEGER NOT NULL,

    CONSTRAINT "UserPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VirtualGarage" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "simPlatform" "Platform" NOT NULL DEFAULT 'iRacing',
    "carMake" TEXT NOT NULL,
    "carModel" TEXT NOT NULL,
    "makeYear" TEXT NOT NULL,
    "carClass" "CarClass" NOT NULL DEFAULT 'DRIFT',
    "livery" TEXT,
    "teamName" TEXT,
    "carNumber" INTEGER,
    "transmission" "Transmission" NOT NULL DEFAULT 'Manual',
    "notes" TEXT,

    CONSTRAINT "VirtualGarage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VirtualLab" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "simPlatform" "Platform" NOT NULL DEFAULT 'iRacing',
    "circuit" TEXT NOT NULL,
    "car" TEXT NOT NULL,
    "lapTime" TIMESTAMP(3) NOT NULL,
    "sessionDate" TIMESTAMP(3) NOT NULL,
    "video" TEXT,
    "telemetrySource" "TelemetrySource" NOT NULL DEFAULT 'iRacing_MoTec',
    "telemetryData" TEXT,
    "tractionControl" BOOLEAN NOT NULL DEFAULT false,
    "abs" BOOLEAN NOT NULL DEFAULT false,
    "stabillity" BOOLEAN NOT NULL DEFAULT false,
    "autoClutch" BOOLEAN NOT NULL DEFAULT true,
    "racingLine" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "VirtualLab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VirtualSimRacingEvent" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "eventTitle" TEXT NOT NULL,
    "simPlatform" "Platform" NOT NULL DEFAULT 'iRacing',
    "circuit" TEXT NOT NULL,
    "eventType" "EventType" NOT NULL DEFAULT 'Race',
    "dateAndTime" TIMESTAMP(3) NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "maxGridSize" INTEGER,
    "visibility" "Visibility" NOT NULL DEFAULT 'Public',
    "serverName" TEXT,
    "serverPassword" TEXT,
    "discordLink" TEXT,
    "notes" TEXT,

    CONSTRAINT "VirtualSimRacingEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WheelsTires" (
    "id" UUID NOT NULL,
    "advancedCarDataId" UUID NOT NULL,
    "wheelAlignmentFront" DOUBLE PRECISION,
    "wheelAlignmentRear" DOUBLE PRECISION,
    "frontToe" DOUBLE PRECISION,
    "rearToe" DOUBLE PRECISION,
    "frontCaster" DOUBLE PRECISION,
    "alignmentNotes" TEXT,

    CONSTRAINT "WheelsTires_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WishList" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WishList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PostHashtags" (
    "A" TEXT NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_PostHashtags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_SentMessages" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_SentMessages_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ReceivedMessages" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_ReceivedMessages_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PaymentToProductList" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_PaymentToProductList_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessProfile_profileId_key" ON "BusinessProfile"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "ChassisBrakes_advancedCarDataId_key" ON "ChassisBrakes"("advancedCarDataId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentCreatorProfile_profileId_key" ON "ContentCreatorProfile"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "DisplayAndPcSetup_simRacingId_key" ON "DisplayAndPcSetup"("simRacingId");

-- CreateIndex
CREATE UNIQUE INDEX "Drivetrain_advancedCarDataId_key" ON "Drivetrain"("advancedCarDataId");

-- CreateIndex
CREATE UNIQUE INDEX "DrivingAssistant_simRacingId_key" ON "DrivingAssistant"("simRacingId");

-- CreateIndex
CREATE UNIQUE INDEX "EnginePower_advancedCarDataId_key" ON "EnginePower"("advancedCarDataId");

-- CreateIndex
CREATE UNIQUE INDEX "Follow_followerId_followingId_key" ON "Follow"("followerId", "followingId");

-- CreateIndex
CREATE INDEX "Garage_profileId_idx" ON "Garage"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "HardwareSetup_simRacingId_key" ON "HardwareSetup"("simRacingId");

-- CreateIndex
CREATE UNIQUE INDEX "Hashtag_tag_key" ON "Hashtag"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "HidePost_userId_postId_key" ON "HidePost"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "InteriorSafety_advancedCarDataId_key" ON "InteriorSafety"("advancedCarDataId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_postId_postType_key" ON "Like"("userId", "postId", "postType");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- CreateIndex
CREATE INDEX "Message_receiverId_idx" ON "Message"("receiverId");

-- CreateIndex
CREATE UNIQUE INDEX "OwnerProfile_profileId_key" ON "OwnerProfile"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "ProDriverProfile_profileId_key" ON "ProDriverProfile"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Racing_simRacingId_key" ON "Racing"("simRacingId");

-- CreateIndex
CREATE UNIQUE INDEX "RacingVote_userId_postId_key" ON "RacingVote"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "Report_userId_targetId_targetType_key" ON "Report"("userId", "targetId", "targetType");

-- CreateIndex
CREATE UNIQUE INDEX "Repost_userId_postId_key" ON "Repost"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "SavePost_userId_postId_key" ON "SavePost"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "SetupDescriptionPhoto_simRacingId_key" ON "SetupDescriptionPhoto"("simRacingId");

-- CreateIndex
CREATE UNIQUE INDEX "Share_userId_postId_key" ON "Share"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "SimRacingProfile_profileId_key" ON "SimRacingProfile"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "SpotterProfile_profileId_key" ON "SpotterProfile"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "TuningAero_advancedCarDataId_key" ON "TuningAero"("advancedCarDataId");

-- CreateIndex
CREATE UNIQUE INDEX "UsageNotes_advancedCarDataId_key" ON "UsageNotes"("advancedCarDataId");

-- CreateIndex
CREATE UNIQUE INDEX "WheelsTires_advancedCarDataId_key" ON "WheelsTires"("advancedCarDataId");

-- CreateIndex
CREATE UNIQUE INDEX "WishList_userId_postId_key" ON "WishList"("userId", "postId");

-- CreateIndex
CREATE INDEX "_PostHashtags_B_index" ON "_PostHashtags"("B");

-- CreateIndex
CREATE INDEX "_SentMessages_B_index" ON "_SentMessages"("B");

-- CreateIndex
CREATE INDEX "_ReceivedMessages_B_index" ON "_ReceivedMessages"("B");

-- CreateIndex
CREATE INDEX "_PaymentToProductList_B_index" ON "_PaymentToProductList"("B");

-- AddForeignKey
ALTER TABLE "AdvancedCarData" ADD CONSTRAINT "AdvancedCarData_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleEntry" ADD CONSTRAINT "BattleEntry_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "Battle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleEntry" ADD CONSTRAINT "BattleEntry_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleParticipant" ADD CONSTRAINT "BattleParticipant_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "Battle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleParticipant" ADD CONSTRAINT "BattleParticipant_particepantId_fkey" FOREIGN KEY ("particepantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleResult" ADD CONSTRAINT "BattleResult_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "Battle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleResult" ADD CONSTRAINT "BattleResult_winnerUserId_fkey" FOREIGN KEY ("winnerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleVote" ADD CONSTRAINT "BattleVote_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "Battle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleVote" ADD CONSTRAINT "BattleVote_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "BattleParticipant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleVote" ADD CONSTRAINT "BattleVote_voterUserId_fkey" FOREIGN KEY ("voterUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessProfile" ADD CONSTRAINT "BusinessProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyProduct" ADD CONSTRAINT "BuyProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ProductList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyProduct" ADD CONSTRAINT "BuyProduct_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyProduct" ADD CONSTRAINT "BuyProduct_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_garageId_fkey" FOREIGN KEY ("garageId") REFERENCES "Garage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_participantsId_fkey" FOREIGN KEY ("participantsId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeParticipant" ADD CONSTRAINT "ChallengeParticipant_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeParticipant" ADD CONSTRAINT "ChallengeParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeResult" ADD CONSTRAINT "ChallengeResult_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeResult" ADD CONSTRAINT "ChallengeResult_winnerUserId_fkey" FOREIGN KEY ("winnerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChassisBrakes" ADD CONSTRAINT "ChassisBrakes_advancedCarDataId_fkey" FOREIGN KEY ("advancedCarDataId") REFERENCES "AdvancedCarData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentCreatorProfile" ADD CONSTRAINT "ContentCreatorProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisplayAndPcSetup" ADD CONSTRAINT "DisplayAndPcSetup_simRacingId_fkey" FOREIGN KEY ("simRacingId") REFERENCES "SimRacingProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drivetrain" ADD CONSTRAINT "Drivetrain_advancedCarDataId_fkey" FOREIGN KEY ("advancedCarDataId") REFERENCES "AdvancedCarData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DrivingAssistant" ADD CONSTRAINT "DrivingAssistant_simRacingId_fkey" FOREIGN KEY ("simRacingId") REFERENCES "SimRacingProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnginePower" ADD CONSTRAINT "EnginePower_advancedCarDataId_fkey" FOREIGN KEY ("advancedCarDataId") REFERENCES "AdvancedCarData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTicket" ADD CONSTRAINT "EventTicket_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTicket" ADD CONSTRAINT "EventTicket_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTicket" ADD CONSTRAINT "EventTicket_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Garage" ADD CONSTRAINT "Garage_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HardwareSetup" ADD CONSTRAINT "HardwareSetup_simRacingId_fkey" FOREIGN KEY ("simRacingId") REFERENCES "SimRacingProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HidePost" ADD CONSTRAINT "HidePost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HidePost" ADD CONSTRAINT "HidePost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HighlightProduct" ADD CONSTRAINT "HighlightProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ProductList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InteriorSafety" ADD CONSTRAINT "InteriorSafety_advancedCarDataId_fkey" FOREIGN KEY ("advancedCarDataId") REFERENCES "AdvancedCarData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegalNotice" ADD CONSTRAINT "LegalNotice_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegalNotice" ADD CONSTRAINT "LegalNotice_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Live" ADD CONSTRAINT "Live_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveParticipant" ADD CONSTRAINT "LiveParticipant_liveId_fkey" FOREIGN KEY ("liveId") REFERENCES "Live"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveParticipant" ADD CONSTRAINT "LiveParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveReward" ADD CONSTRAINT "LiveReward_liveId_fkey" FOREIGN KEY ("liveId") REFERENCES "Live"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveReward" ADD CONSTRAINT "LiveReward_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveReward" ADD CONSTRAINT "LiveReward_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnerProfile" ADD CONSTRAINT "OwnerProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "EventTicket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_buyProductId_fkey" FOREIGN KEY ("buyProductId") REFERENCES "BuyProduct"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProDriverProfile" ADD CONSTRAINT "ProDriverProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductList" ADD CONSTRAINT "ProductList_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Racing" ADD CONSTRAINT "Racing_simRacingId_fkey" FOREIGN KEY ("simRacingId") REFERENCES "SimRacingProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RacingVote" ADD CONSTRAINT "RacingVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RacingVote" ADD CONSTRAINT "RacingVote_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repost" ADD CONSTRAINT "Repost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repost" ADD CONSTRAINT "Repost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavePost" ADD CONSTRAINT "SavePost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavePost" ADD CONSTRAINT "SavePost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetupDescriptionPhoto" ADD CONSTRAINT "SetupDescriptionPhoto_simRacingId_fkey" FOREIGN KEY ("simRacingId") REFERENCES "SimRacingProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimRacingProfile" ADD CONSTRAINT "SimRacingProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpotterProfile" ADD CONSTRAINT "SpotterProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TuningAero" ADD CONSTRAINT "TuningAero_advancedCarDataId_fkey" FOREIGN KEY ("advancedCarDataId") REFERENCES "AdvancedCarData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageNotes" ADD CONSTRAINT "UsageNotes_advancedCarDataId_fkey" FOREIGN KEY ("advancedCarDataId") REFERENCES "AdvancedCarData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPoint" ADD CONSTRAINT "UserPoint_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPoint" ADD CONSTRAINT "UserPoint_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPoint" ADD CONSTRAINT "UserPoint_likeId_fkey" FOREIGN KEY ("likeId") REFERENCES "Like"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPoint" ADD CONSTRAINT "UserPoint_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPoint" ADD CONSTRAINT "UserPoint_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "Battle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualGarage" ADD CONSTRAINT "VirtualGarage_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualLab" ADD CONSTRAINT "VirtualLab_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualSimRacingEvent" ADD CONSTRAINT "VirtualSimRacingEvent_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WheelsTires" ADD CONSTRAINT "WheelsTires_advancedCarDataId_fkey" FOREIGN KEY ("advancedCarDataId") REFERENCES "AdvancedCarData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishList" ADD CONSTRAINT "WishList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishList" ADD CONSTRAINT "WishList_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostHashtags" ADD CONSTRAINT "_PostHashtags_A_fkey" FOREIGN KEY ("A") REFERENCES "Hashtag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostHashtags" ADD CONSTRAINT "_PostHashtags_B_fkey" FOREIGN KEY ("B") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SentMessages" ADD CONSTRAINT "_SentMessages_A_fkey" FOREIGN KEY ("A") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SentMessages" ADD CONSTRAINT "_SentMessages_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReceivedMessages" ADD CONSTRAINT "_ReceivedMessages_A_fkey" FOREIGN KEY ("A") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReceivedMessages" ADD CONSTRAINT "_ReceivedMessages_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PaymentToProductList" ADD CONSTRAINT "_PaymentToProductList_A_fkey" FOREIGN KEY ("A") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PaymentToProductList" ADD CONSTRAINT "_PaymentToProductList_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
