-- CreateEnum
CREATE TYPE "ChallengeType" AS ENUM ('PHOTO', 'VIDEO', 'LAP_TIME', 'EXPLORATION');

-- CreateEnum
CREATE TYPE "ChallengeCategory" AS ENUM ('DAILY', 'SPOTTER', 'COMMUNITY', 'BRAND');

-- CreateEnum
CREATE TYPE "Preference" AS ENUM ('CAR', 'BIKE', 'BOTH');

-- CreateEnum
CREATE TYPE "ParticipationScope" AS ENUM ('GLOBAL', 'RADIUS');

-- CreateEnum
CREATE TYPE "ChallengeStatus" AS ENUM ('ACTIVE', 'UPCOMING', 'FINISHED');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('MOBILE', 'DSLR', 'MIRRORLESS', 'ACTION_CAMERA', 'DRONE', 'OTHER');

-- CreateEnum
CREATE TYPE "QuickPreset" AS ENUM ('NONE_ALL_DEVICE', 'MOBAILE_ONLY', 'DSLR_CAMERAS_ONLY', 'MIRRORLESS_CAMERAS_ONLY', 'ACTION_CAMERAS_ONLY', 'IPHONE_ONLY', 'CANON_ONLY', 'SONY_ONLY', 'TRUE_SHOT');

-- CreateEnum
CREATE TYPE "Brand" AS ENUM ('APPLE', 'SUMSUNG', 'GOOGLE', 'HUAWEI', 'XIAOMI', 'ONEPLUS', 'OPPO', 'VIVO', 'CANON', 'NIKON', 'SONY', 'FUJIFILM', 'PANASONIC', 'LEICA', 'OLYMPUS', 'PENTAX', 'GOPRO', 'DJI', 'INSTA360');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('LIKE', 'LOVE', 'FIRE', 'WOW');

-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('IMAGE', 'DOCS', 'LINK', 'DOCUMENT', 'ANY', 'VIDEO', 'AUDIO');

-- CreateEnum
CREATE TYPE "BattleAccessType" AS ENUM ('OPEN', 'INVITATION_ONLY', 'AUTO_INVITE', 'FOLLOWERS_ONLY');

-- CreateEnum
CREATE TYPE "AutoInviteScope" AS ENUM ('SAME_CITY', 'SAME_COUNTRY_500KM', 'WORLDWIDE');

-- CreateEnum
CREATE TYPE "CameraRequirement" AS ENUM ('ANY', 'MOBILE_ONLY', 'DSLR_MIRRORLESS_ONLY', 'PROFESSIONAL_ONLY');

-- CreateEnum
CREATE TYPE "BattleStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'RUNNING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ParticipantStatus" AS ENUM ('JOINED', 'LEFT', 'DISQUALIFIED');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "BattleCategory" AS ENUM ('STYLE_BATTLE', 'STANCE_BATTLE', 'RACING_BATTLE', 'CLASSIC_BATTLE', 'JDM_BATTLE', 'EURO_BATTLE', 'MUSCLE_BATTLE', 'OFF_ROAD_BATTLE');

-- CreateEnum
CREATE TYPE "PhotoEditingDeclaration" AS ENUM ('NO_EDITING', 'EDITED_WITH_ADOBE_LIGHTROOM', 'EDITED_WITH_ADOBE_PHOTOSHOP', 'EDITED_WITH_SNAPSEED', 'EDITED_WITH_VSCO', 'EDITED_WITH_OTHER_SOFTWARE');

-- CreateEnum
CREATE TYPE "VideoEditingDeclaration" AS ENUM ('ADOBE_PREMIER_PRO', 'DAVINCI_RESOLVE', 'AVID_MEDIA_COMPOSER', 'FINAL_CUT_PRO');

-- CreateEnum
CREATE TYPE "VisiualStyle" AS ENUM ('Action', 'Aerial', 'Artistic', 'Drift', 'Black_And_White', 'Cinematic', 'Close_Up', 'Motion_Blur', 'Day', 'Detail_Shot', 'Golden_Hour', 'Long_Exposure', 'Macro', 'Night_Shot', 'Panoramic', 'Panning', 'Raw', 'Rollin_Shot', 'Wet_Conditions', 'Wide_Angle', 'Abandoned', 'AI_Generated');

-- CreateEnum
CREATE TYPE "ContextActivity" AS ENUM ('Car_Meet', 'Celebration', 'Drag_Race', 'Diving', 'Garage', 'Highway', 'Iconic_Location', 'Offroad', 'Onboard', 'Mountain_Road', 'Natural_Landscape', 'Perked', 'Rally', 'Road', 'Static', 'Studio', 'Trackday', 'Urban');

-- CreateEnum
CREATE TYPE "Subject" AS ENUM ('Brake_Details', 'Cockpit', 'Driver_Portrait', 'Engine_Bay', 'Exterior', 'Front_Detail', 'Interior', 'Logos', 'Rear_Detail', 'Side', 'Wheel');

-- CreateEnum
CREATE TYPE "RawShiftStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'RUNNING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RawShiftEntryStatus" AS ENUM ('SUBMITTED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "RawShiftSoftware" AS ENUM ('ANY', 'LIGHTROOM', 'PHOTOSHOP', 'CAPTURE_ONE', 'SNAPSEED', 'OTHER');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'AMBASSADOR', 'OFFICIAL_PARTNER');

-- CreateEnum
CREATE TYPE "LegalNoticeTarget" AS ENUM ('CAR', 'BIKE');

-- CreateEnum
CREATE TYPE "Type" AS ENUM ('SPOTTER', 'OWNER', 'CONTENT_CREATOR', 'PRO_BUSSINESS', 'PRO_DRIVER', 'SIM_RACING_DRIVER');

-- CreateEnum
CREATE TYPE "IsActive" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'SUSPEND', 'INACTIVE');

-- CreateEnum
CREATE TYPE "Media" AS ENUM ('PHOTO', 'VIDEO');

-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('Spotter_Post', 'Owner_Post', 'ContentCretor_Post', 'ProBussiness_Post', 'ProDriver_Post', 'SimRacing_Post');

-- CreateEnum
CREATE TYPE "PointType" AS ENUM ('BATTLE_WIN', 'POST', 'LIKE', 'COMMENT', 'ONGOING');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED');

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
CREATE TYPE "VehicleCategory" AS ENUM ('CITY', 'HOT_HATCH', 'SEDAN', 'SPORT', 'SUV', 'SUPERCAR', 'TRACK', 'CLASSIC', 'NAKED', 'ADVENTURE', 'TOURING', 'CUSTOM', 'SCOOTER', 'OFF_ROAD', 'MOTOCROSS', 'ENDURO', 'TRIAL', 'ELECTRIC');

-- CreateEnum
CREATE TYPE "BusinessCategory" AS ENUM ('Detailling_Care', 'Parts_Performance', 'Ecu_Dyno_Tuning', 'Wrap_Vinyl', 'Motorsport_Service', 'Event_Promoter', 'Media_Podcast', 'Dealership', 'Body_Coachbuilder', 'Auto_Recycling', 'Inspection_Technical');

-- CreateEnum
CREATE TYPE "BodyType" AS ENUM ('CITY', 'HOT_HATCH', 'SEDAN', 'SPORT', 'SUV', 'SUPERCAR', 'TRACK', 'CLASSIC');

-- CreateEnum
CREATE TYPE "BikeBodyType" AS ENUM ('SPORT', 'NAKED', 'ADVENTURE', 'TOURING', 'CUSTOM', 'SCOOTER', 'OFF_ROAD', 'MOTOCROSS', 'ENDURO', 'TRIAL', 'CLASSIC', 'ELECTRIC');

-- CreateEnum
CREATE TYPE "Transmission" AS ENUM ('MANUAL', 'AUTOMATIC', 'SEQUENTIAL', 'DCT', 'CVT');

-- CreateEnum
CREATE TYPE "DriveTrain" AS ENUM ('RWD', 'FWD', 'AWD', 'FOUR_WD');

-- CreateEnum
CREATE TYPE "DriveTrainBike" AS ENUM ('CHAIN', 'BELT', 'SHAFT');

-- CreateEnum
CREATE TYPE "DriveCategory" AS ENUM ('DAILY_DRIVE', 'WEEEKEND_WARRIOR', 'TRACK_TOOL', 'SHOW_CAR', 'PROJECT_CAR');

-- CreateEnum
CREATE TYPE "DriveCategoryBike" AS ENUM ('DAILY_RIDER', 'TRACK_BIKE', 'SHOW_BIKE');

-- CreateEnum
CREATE TYPE "TrackCondition" AS ENUM ('Dry', 'Damp', 'Wet', 'Dusty', 'Greasy');

-- CreateEnum
CREATE TYPE "Weather" AS ENUM ('Sunny', 'Cloudy', 'Overcast', 'Light_Rain', 'Heavy_Rain', 'Mixed');

-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('TRACK_DAY', 'PRIVATE_SECTION', 'RACE_WEEKEND', 'TEST_DAY', 'TIME_ATTACK_EVENT');

-- CreateEnum
CREATE TYPE "TireCompound" AS ENUM ('SOFT', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "DriveStyle" AS ENUM ('Conservative_Leaving_Margin', 'Moderate_Balanced_Approach', 'Aggressive_Pushing_Hard', 'At_The_Limit_Full_Send');

-- CreateEnum
CREATE TYPE "CarFound" AS ENUM ('Auction', 'Dealer', 'Private_Seller', 'Online_Marketplace', 'Family', 'Friend', 'Barn_Find', 'Other');

-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('iRacing', 'Assetto_Corsa_Competizione', 'Assetto_Corsa', 'Gran_Turismo_7', 'Forza_Motorsport', 'F1_24', 'F1_23', 'rFactor_2', 'Automobilista_2', 'RaceRoom_Racing_Experience', 'Project_CARS_2', 'BeamNG_drive', 'Dirt_Rally', 'Le_Mans_Ultimate', 'Assetto_Corsa_EVO', 'Asseto_Corsa_Rally', 'Other');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('Public', 'Private', 'Friend', 'Only_Me');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('Race', 'League_Race', 'Hot_Lap_Session', 'Practice_Session', 'Endurance_Race', 'Time_Attack', 'Drift_Session', 'Other');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('POST', 'PROFILE');

-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('CAR_PARTS', 'CAR', 'BIKE', 'BIKE_PARTS', 'PHOTOGRAPHY', 'SIM_RACING');

-- CreateEnum
CREATE TYPE "CarClass" AS ENUM ('GT3', 'GT4', 'GTE', 'LMP2', 'F124', 'LMP1', 'FORMULA_1', 'FORMULA_2', 'FORMULA_3', 'TOURING_CAR', 'STOCK_CAR', 'RALLY', 'DRIFT', 'ROAD_CAR', 'PROTOTYPE', 'VINTAGE', 'OTHER');

-- CreateEnum
CREATE TYPE "Circuit" AS ENUM ('Spa_Francorchamps', 'Nurburgring_Nordschleife', 'Nurburgring_GP', 'Monza', 'Silverstone', 'Brands_Hatch', 'Laguna_Seca', 'Mount_Panorama', 'Suzuka', 'Interlagos', 'Imola');

-- CreateEnum
CREATE TYPE "TelemetrySource" AS ENUM ('iRacing_MoTec', 'ACC_Mo_Tec', 'SimHub', 'Crew_Chief', 'Z1_Dashboard', 'Racelab', 'Kapps', 'Other');

-- CreateEnum
CREATE TYPE "OfficialPartnerRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AmbassadorStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "HashtagCreatedBy" AS ENUM ('ADMIN', 'SYSTEM');

-- CreateEnum
CREATE TYPE "ReceiptStatus" AS ENUM ('SENT', 'DELIVERED', 'READ');

-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Hydrogen', 'E85');

-- CreateEnum
CREATE TYPE "EcuTune" AS ENUM ('Stock', 'Stage_1', 'Stage_2', 'Stage_3', 'Custom');

-- CreateEnum
CREATE TYPE "UsageCategory" AS ENUM ('Street', 'Trackday', 'Race', 'Time_Attack', 'Drift', 'Show');

-- CreateEnum
CREATE TYPE "DriverLevel" AS ENUM ('Amateur', 'Semi_Pro', 'Pro');

-- CreateEnum
CREATE TYPE "UsageMode" AS ENUM ('Daily', 'Weekend', 'Track_Only', 'Show_Only');

-- CreateEnum
CREATE TYPE "SteeringWheel" AS ENUM ('FANATEC', 'THRUSTMASTER', 'SIMUCUBE', 'MOZA_RACING', 'ASETEK_SIM_SPORTS', 'SIMAGIC', 'CAMMUS', 'VRS_DIRECT_FORCE', 'ACCUFORCE', 'AUGURY', 'OTHER');

-- CreateEnum
CREATE TYPE "WheelModel" AS ENUM ('FANATEC', 'LOGITECH', 'THRUSTMASTER', 'HEUSINKVELD', 'SIMUCUBE', 'MOZA_RACING', 'ASETEK_SIM_SPORTS', 'SIMAGIC', 'WAVE_ITALY', 'OTHER');

-- CreateEnum
CREATE TYPE "WheelBase" AS ENUM ('DESK_MOUNT', 'WHEEL_STAND', 'COCKPIT', 'FULL_MOTION', 'RIG', 'DIY_RIG');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('LIKE', 'COMMENT', 'FOLLOW', 'MENTION', 'TAGGED', 'SHARE', 'BATTLE_INVITE', 'BATTLE_RESULT', 'CHALLENGE_INVITE', 'CHALLENGE_RESULT', 'LAPTIME_BEATEN', 'LAPTIME_COMPARE', 'SYSTEM', 'ADMIN');

-- CreateEnum
CREATE TYPE "NotificationEntityType" AS ENUM ('POST', 'COMMENT', 'USER', 'PROFILE', 'BATTLE', 'CHALLENGE', 'SUBMIT_LAB_TIME', 'LAB_TIME', 'PRIZE', 'PAYMENT', 'EVENT', 'OTHER');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('IN_APP', 'PUSH', 'EMAIL');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('UNREAD', 'READ', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SplitScreenArenaStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "SplitScreenMatchStatus" AS ENUM ('SEARCHING', 'MATCHED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "SplitScreenBattleStatus" AS ENUM ('PENDING', 'LIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SplitScreenBattleCategory" AS ENUM ('STYLES', 'RACING', 'CLASSIC', 'STANCE', 'DRIFT', 'OFF_ROAD');

-- CreateEnum
CREATE TYPE "SplitScreenMatchmakingMode" AS ENUM ('ANYONE', 'ONLINE_ONLY');

-- CreateEnum
CREATE TYPE "SplitScreenPreferenceMode" AS ENUM ('ANY_CAR_BRAND', 'SAME_BRAND_ONLY', 'SAME_MODEL_ONLY', 'SPECIFIC_BRAND', 'SIMILAR_PRESTIGE');

-- CreateEnum
CREATE TYPE "SplitScreenLeagueCode" AS ENUM ('WORLD', 'EUROPE', 'USA', 'UK', 'FRANCE', 'GERMANY', 'SPAIN');

-- CreateEnum
CREATE TYPE "SplitScreenDivision" AS ENUM ('D1', 'D2', 'D3');

-- CreateEnum
CREATE TYPE "SplitScreenVoteType" AS ENUM ('LEFT', 'RIGHT');

-- CreateEnum
CREATE TYPE "SplitScreenParticipantResult" AS ENUM ('WIN', 'LOSS', 'DRAW');

-- CreateTable
CREATE TABLE "AdvancedCarData" (
    "id" UUID NOT NULL,
    "carId" UUID NOT NULL,

    CONSTRAINT "AdvancedCarData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AmbassadorProgram" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "status" "AmbassadorStatus" NOT NULL DEFAULT 'PENDING',
    "motorspotName" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "instagramProfile" TEXT,
    "tiktokProfile" TEXT,
    "youTubeChanel" TEXT,
    "totalFollower" INTEGER NOT NULL,
    "mainCar" TEXT,
    "whyDoYouWant" TEXT NOT NULL,
    "releventExperience" TEXT,
    "profilePhoto" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AmbassadorProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bike" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "garageId" UUID NOT NULL,
    "image" TEXT,
    "make" TEXT,
    "model" TEXT,
    "bodyType" "BikeBodyType" NOT NULL DEFAULT 'SPORT',
    "transmission" "Transmission" NOT NULL DEFAULT 'MANUAL',
    "driveTrain" "DriveTrainBike" NOT NULL DEFAULT 'CHAIN',
    "country" TEXT,
    "color" TEXT,
    "displayName" TEXT,
    "description" TEXT,
    "category" "DriveCategoryBike" NOT NULL DEFAULT 'DAILY_RIDER',
    "listOnMarketplace" BOOLEAN NOT NULL DEFAULT false,
    "price" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Bike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdvancedBikeData" (
    "id" UUID NOT NULL,
    "bikeId" UUID NOT NULL,

    CONSTRAINT "AdvancedBikeData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EngineAndPerformance" (
    "id" UUID NOT NULL,
    "advancedBikeDataId" UUID NOT NULL,
    "engineType" TEXT NOT NULL,
    "displacement" INTEGER,
    "power" INTEGER,
    "torque" INTEGER,
    "ecu" TEXT,

    CONSTRAINT "EngineAndPerformance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BikeDriveTrains" (
    "id" UUID NOT NULL,
    "advancedBikeDataId" UUID NOT NULL,
    "transmissionMods" TEXT,
    "differential" TEXT,
    "clutch" TEXT,

    CONSTRAINT "BikeDriveTrains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Suspension" (
    "id" UUID NOT NULL,
    "advancedBikeDataId" UUID NOT NULL,
    "frontSuspension" TEXT,
    "rearSuspension" TEXT,
    "frontBrakes" TEXT,
    "rearBrake" TEXT,
    "abs" TEXT,
    "notes" TEXT,

    CONSTRAINT "Suspension_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BikeWheelTires" (
    "id" UUID NOT NULL,
    "advancedBikeDataId" UUID NOT NULL,
    "wheels" TEXT,
    "tires" TEXT,

    CONSTRAINT "BikeWheelTires_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BikeElectronics" (
    "id" UUID NOT NULL,
    "advancedBikeDataId" UUID NOT NULL,
    "riding" TEXT,
    "tractionControl" TEXT,
    "wheelieControl" TEXT,

    CONSTRAINT "BikeElectronics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BikeUsageAndNotes" (
    "id" UUID NOT NULL,
    "advancedBikeDataId" UUID NOT NULL,
    "weight" INTEGER,
    "primaryUsage" TEXT,
    "ridingLevel" TEXT,
    "buildStatus" TEXT,
    "notes" TEXT,

    CONSTRAINT "BikeUsageAndNotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessProfile" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "profileType" "Type" NOT NULL DEFAULT 'PRO_BUSSINESS',
    "businessCategory" "BusinessCategory" NOT NULL DEFAULT 'Detailling_Care',
    "businessName" TEXT NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "BusinessProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Car" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "garageId" UUID NOT NULL,
    "image" TEXT,
    "make" TEXT,
    "model" TEXT,
    "bodyType" "BodyType" NOT NULL DEFAULT 'CLASSIC',
    "transmission" "Transmission" NOT NULL DEFAULT 'MANUAL',
    "driveTrain" "DriveTrain" NOT NULL DEFAULT 'RWD',
    "country" TEXT,
    "color" TEXT,
    "displayName" TEXT,
    "description" TEXT,
    "category" "DriveCategory" NOT NULL DEFAULT 'DAILY_DRIVE',
    "listOnMarketplace" BOOLEAN NOT NULL DEFAULT false,
    "price" INTEGER,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Challenge" (
    "id" UUID NOT NULL,
    "creatorId" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "type" "ChallengeType" NOT NULL,
    "category" "ChallengeCategory" NOT NULL,
    "preference" "Preference" NOT NULL,
    "coverImage" TEXT,
    "participationScope" "ParticipationScope" NOT NULL DEFAULT 'GLOBAL',
    "radiusKm" INTEGER,
    "locationName" VARCHAR(150),
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "startDate" TIMESTAMPTZ(6) NOT NULL,
    "endDate" TIMESTAMPTZ(6) NOT NULL,
    "challengePrize" TEXT NOT NULL,
    "enableDeviceRestriction" BOOLEAN NOT NULL DEFAULT false,
    "quickPreset" "QuickPreset" NOT NULL DEFAULT 'NONE_ALL_DEVICE',
    "deviceType" "DeviceType" NOT NULL DEFAULT 'MOBILE',
    "brand" "Brand" NOT NULL DEFAULT 'APPLE',
    "requireTrueShotVerification" BOOLEAN NOT NULL DEFAULT false,
    "rejectEditedPhotos" BOOLEAN NOT NULL DEFAULT false,
    "maxEntriesPerUser" INTEGER NOT NULL DEFAULT 1,
    "status" "ChallengeStatus" DEFAULT 'UPCOMING',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChallengeParticipant" (
    "id" UUID NOT NULL,
    "challengeId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "status" "ParticipantStatus" NOT NULL DEFAULT 'JOINED',
    "joinedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMPTZ(6),
    "totalVotes" INTEGER NOT NULL DEFAULT 0,
    "totalLikes" INTEGER NOT NULL DEFAULT 0,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "rank" INTEGER,

    CONSTRAINT "ChallengeParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChallengeSubmission" (
    "id" UUID NOT NULL,
    "challengeId" UUID NOT NULL,
    "participantId" UUID NOT NULL,
    "caption" TEXT,
    "hashtags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "isTrueShotVerified" BOOLEAN NOT NULL DEFAULT false,
    "isEditedDetected" BOOLEAN NOT NULL DEFAULT false,
    "verificationNote" TEXT,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "voteCount" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "ChallengeSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChallengeSubmissionMedia" (
    "id" UUID NOT NULL,
    "submissionId" UUID NOT NULL,
    "type" "MediaType" NOT NULL,
    "url" TEXT NOT NULL,
    "durationSec" INTEGER,
    "thumbnailUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "pairKey" VARCHAR(50),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChallengeSubmissionMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChallengeReaction" (
    "id" UUID NOT NULL,
    "submissionId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" "ReactionType" NOT NULL DEFAULT 'LIKE',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChallengeReaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChallengeVote" (
    "id" UUID NOT NULL,
    "submissionId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChallengeVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChallengeComment" (
    "id" UUID NOT NULL,
    "submissionId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "parentId" UUID,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "ChallengeComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChallengeResult" (
    "id" UUID NOT NULL,
    "challengeId" UUID NOT NULL,
    "totalParticipants" INTEGER NOT NULL DEFAULT 0,
    "totalSubmissions" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChallengeResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChallengeWinner" (
    "id" UUID NOT NULL,
    "resultId" UUID NOT NULL,
    "challengeId" UUID NOT NULL,
    "participantId" UUID NOT NULL,
    "submissionId" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "finalVotes" INTEGER NOT NULL DEFAULT 0,
    "finalScore" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChallengeWinner_pkey" PRIMARY KEY ("id")
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
    "parentId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentCreatorProfile" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "creatorCategory" "ContentCategory" NOT NULL DEFAULT 'PHOTOGRAPHY',
    "profileType" "Type" NOT NULL DEFAULT 'CONTENT_CREATOR',
    "youtubeChanel" TEXT,
    "portfolioWebsite" TEXT,

    CONSTRAINT "ContentCreatorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" UUID NOT NULL,
    "isGroup" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastMessageId" UUID,
    "lastMessageAt" TIMESTAMP(3),

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationParticipant" (
    "id" UUID NOT NULL,
    "conversationId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "lastReadAt" TIMESTAMP(3),
    "unreadCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConversationParticipant_pkey" PRIMARY KEY ("id")
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
    "transmissionMods" TEXT,
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
    "horsepowerHp" INTEGER,
    "torqueNm" INTEGER,
    "weightKg" INTEGER,
    "engineDescription" TEXT,
    "fuelType" "FuelType" NOT NULL DEFAULT 'Gasoline',
    "turboOrSupercharger" TEXT,
    "intercooler" TEXT,
    "exhaustSystem" TEXT,
    "intakeSystem" TEXT,
    "fuelSystemMods" TEXT,
    "coolingUpgrades" TEXT,
    "dynoWeightKg" INTEGER,
    "rpmLimiter" INTEGER,

    CONSTRAINT "EnginePower_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" UUID NOT NULL,
    "ownerId" UUID NOT NULL,
    "profileType" "Type",
    "coverImage" TEXT NOT NULL,
    "eventTitle" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "websiteLink" TEXT,
    "price" INTEGER NOT NULL,
    "eventType" "EventType" NOT NULL DEFAULT 'Race',
    "eventStatus" "EventStatus" NOT NULL DEFAULT 'UPCOMING',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_instances" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fileType" "FileType" NOT NULL DEFAULT 'ANY',
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "file_instances_pkey" PRIMARY KEY ("id")
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
    "steeringWheel" "SteeringWheel" NOT NULL DEFAULT 'FANATEC',
    "wheelModel" "WheelModel" NOT NULL DEFAULT 'LOGITECH',
    "wheelbase" "WheelBase" NOT NULL DEFAULT 'DESK_MOUNT',
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
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" "HashtagCreatedBy" NOT NULL DEFAULT 'ADMIN',
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hashtag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeadToHeadBattle" (
    "id" UUID NOT NULL,
    "creatorId" UUID NOT NULL,
    "winnerUserId" UUID,
    "title" VARCHAR(255) NOT NULL,
    "preference" "Preference" NOT NULL DEFAULT 'CAR',
    "description" TEXT,
    "coverImage" TEXT,
    "battleCategory" "BattleCategory" NOT NULL DEFAULT 'STYLE_BATTLE',
    "brandFilter" TEXT,
    "durationDays" INTEGER,
    "winPrize" TEXT NOT NULL,
    "uploadImageOrVideo" TEXT NOT NULL,
    "cameraRequirement" "CameraRequirement" NOT NULL DEFAULT 'ANY',
    "requireTrueShotVerified" BOOLEAN NOT NULL DEFAULT false,
    "rejectEditedPhotos" BOOLEAN NOT NULL DEFAULT false,
    "accessType" "BattleAccessType" NOT NULL DEFAULT 'OPEN',
    "autoInviteScope" "AutoInviteScope",
    "autoInviteCount" INTEGER,
    "participationScope" "ParticipationScope" NOT NULL DEFAULT 'GLOBAL',
    "radiusKm" INTEGER,
    "locationName" VARCHAR(150),
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "placeId" VARCHAR(120),
    "startDate" TIMESTAMPTZ(6) NOT NULL,
    "endDate" TIMESTAMPTZ(6) NOT NULL,
    "status" "BattleStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "HeadToHeadBattle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BattleParticipant" (
    "id" UUID NOT NULL,
    "battleId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "status" "ParticipantStatus" NOT NULL DEFAULT 'JOINED',
    "joinedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BattleParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BattleInvitation" (
    "id" UUID NOT NULL,
    "battleId" UUID NOT NULL,
    "inviterId" UUID NOT NULL,
    "inviteeId" UUID NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),

    CONSTRAINT "BattleInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BattleSubmission" (
    "id" UUID NOT NULL,
    "battleId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "mediaUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "caption" TEXT,
    "isTrueShotVerified" BOOLEAN NOT NULL DEFAULT false,
    "isEditedDetected" BOOLEAN NOT NULL DEFAULT false,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'SUBMITTED',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BattleSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BattleVote" (
    "id" UUID NOT NULL,
    "submissionId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "battleId" UUID NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BattleVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BattleComment" (
    "id" UUID NOT NULL,
    "battleId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "submissionId" UUID,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BattleComment_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "InteriorSafety" (
    "id" UUID NOT NULL,
    "advancedCarDataId" UUID NOT NULL,
    "seats" TEXT,
    "harness" TEXT,

    CONSTRAINT "InteriorSafety_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabTime" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "trackName" VARCHAR(255) NOT NULL,
    "trackLayout" VARCHAR(255),
    "carName" VARCHAR(255) NOT NULL,
    "lapTimeMs" INTEGER NOT NULL,
    "dateSet" TIMESTAMPTZ(6) NOT NULL,
    "videoUrl" VARCHAR(500),
    "telemetryMedia" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "transmission" "Transmission" NOT NULL DEFAULT 'MANUAL',
    "drivetrain" "DriveTrain" NOT NULL DEFAULT 'RWD',
    "timeOfDay" TEXT NOT NULL,
    "sessionType" "SessionType" NOT NULL DEFAULT 'TRACK_DAY',
    "weather" "Weather" NOT NULL DEFAULT 'Sunny',
    "trackCondition" "TrackCondition" NOT NULL DEFAULT 'Dry',
    "airTemp" INTEGER,
    "trackTemp" INTEGER,
    "humidity" INTEGER,
    "tireBrand" TEXT NOT NULL,
    "tireModel" TEXT NOT NULL,
    "tireCompund" "TireCompound" NOT NULL DEFAULT 'SOFT',
    "tireWear" INTEGER,
    "frontTireSize" INTEGER,
    "frontPressure" TEXT,
    "rearTireSize" INTEGER,
    "rearPressure" TEXT,
    "drivingStyle" "DriveStyle" NOT NULL DEFAULT 'Moderate_Balanced_Approach',
    "fuelLoad" INTEGER,
    "driverWeight" INTEGER,
    "additionalNotes" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "LabTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegalNotice" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "targetType" "LegalNoticeTarget" NOT NULL,
    "carId" UUID,
    "bikeId" UUID,
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
    "conversationId" UUID NOT NULL,
    "senderId" UUID NOT NULL,
    "content" TEXT,
    "fileUrl" TEXT,
    "clientMsgId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageReceipt" (
    "id" UUID NOT NULL,
    "messageId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "status" "ReceiptStatus" NOT NULL DEFAULT 'SENT',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "actorUserId" UUID,
    "type" "NotificationType" NOT NULL,
    "channel" "NotificationChannel" NOT NULL DEFAULT 'IN_APP',
    "status" "NotificationStatus" NOT NULL DEFAULT 'UNREAD',
    "title" VARCHAR(120),
    "message" TEXT,
    "deepLink" VARCHAR(500),
    "entityType" "NotificationEntityType",
    "entityId" UUID,
    "meta" JSONB,
    "groupKey" VARCHAR(200),
    "readAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationPreference" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "inAppEnabled" BOOLEAN NOT NULL DEFAULT true,
    "pushEnabled" BOOLEAN NOT NULL DEFAULT true,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT false,
    "mutedTypes" "NotificationType"[],
    "quietStart" VARCHAR(5),
    "quietEnd" VARCHAR(5),
    "timezone" VARCHAR(50),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceToken" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "platform" VARCHAR(20),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "DeviceToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfficialPartner" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "requestStatus" "OfficialPartnerRequestStatus" NOT NULL DEFAULT 'PENDING',
    "brandLogo" TEXT,
    "brandName" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "brandDescription" TEXT,
    "websiteUrl" TEXT,
    "industry" TEXT,
    "country" TEXT,
    "companyRegistrationNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OfficialPartner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OwnerProfile" (
    "id" UUID NOT NULL,
    "profileType" "Type" NOT NULL DEFAULT 'OWNER',
    "profileId" UUID NOT NULL,

    CONSTRAINT "OwnerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
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
    "profileId" UUID,
    "profileType" "Type",
    "postType" "PostType" NOT NULL DEFAULT 'Spotter_Post',
    "caption" TEXT,
    "mediaUrl" TEXT,
    "postLocation" TEXT,
    "locationName" TEXT,
    "locationAddress" TEXT,
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "placeId" TEXT,
    "locationVisibility" TEXT,
    "vehicleCategory" "VehicleCategory" NOT NULL DEFAULT 'CLASSIC',
    "mediaType" "MediaType" NOT NULL DEFAULT 'IMAGE',
    "like" INTEGER NOT NULL DEFAULT 0,
    "comment" INTEGER NOT NULL DEFAULT 0,
    "share" INTEGER NOT NULL DEFAULT 0,
    "contentBooster" BOOLEAN NOT NULL DEFAULT false,
    "point" INTEGER NOT NULL DEFAULT 5,
    "photoEditingDeclaration" "PhotoEditingDeclaration",
    "videoEditingDeclaration" "VideoEditingDeclaration",
    "visiualStyle" "VisiualStyle"[] DEFAULT ARRAY[]::"VisiualStyle"[],
    "contextActivity" "ContextActivity"[] DEFAULT ARRAY[]::"ContextActivity"[],
    "subject" "Subject"[] DEFAULT ARRAY[]::"Subject"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prize" (
    "id" UUID NOT NULL,
    "prizeName" TEXT NOT NULL,
    "createdById" UUID NOT NULL,

    CONSTRAINT "Prize_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProDriverProfile" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "profileType" "Type" NOT NULL DEFAULT 'PRO_DRIVER',
    "racingDiscipline" "VehicleCategory" NOT NULL DEFAULT 'CITY',
    "location" TEXT NOT NULL,

    CONSTRAINT "ProDriverProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductList" (
    "id" UUID NOT NULL,
    "ownerId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "productImage" TEXT,
    "location" TEXT,
    "description" TEXT,
    "category" "ProductCategory" NOT NULL DEFAULT 'CAR',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "carBrand" TEXT,
    "carModel" TEXT,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "showWhatsappNo" BOOLEAN NOT NULL DEFAULT false,
    "highlightProduct" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "activeType" "Type",
    "profileName" TEXT,
    "bio" TEXT,
    "imageUrl" TEXT,
    "instagramHandler" TEXT,
    "accountType" "AccountType" NOT NULL DEFAULT 'PUBLIC',
    "preference" "Preference",
    "isActive" "IsActive" NOT NULL DEFAULT 'ACTIVE',
    "suspend" BOOLEAN NOT NULL DEFAULT false,
    "locationStatus" BOOLEAN NOT NULL DEFAULT false,

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
CREATE TABLE "RawShiftBattle" (
    "id" UUID NOT NULL,
    "creatorId" UUID NOT NULL,
    "winnerUserId" UUID,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "coverImage" TEXT,
    "bannerImage" TEXT,
    "participantLimit" INTEGER,
    "rawShiftPrice" TEXT NOT NULL,
    "location" VARCHAR(150),
    "startDate" TIMESTAMPTZ(6) NOT NULL,
    "endDate" TIMESTAMPTZ(6) NOT NULL,
    "status" "RawShiftStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "RawShiftBattle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RawShiftParticipant" (
    "id" UUID NOT NULL,
    "battleId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "joinedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),

    CONSTRAINT "RawShiftParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RawShiftEntry" (
    "id" UUID NOT NULL,
    "battleId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "rawMediaUrl" TEXT NOT NULL,
    "rawThumbnailUrl" TEXT,
    "editedMediaUrl" TEXT NOT NULL,
    "editedThumbnailUrl" TEXT,
    "caption" TEXT,
    "hashtags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "RawShiftEntryStatus" NOT NULL DEFAULT 'SUBMITTED',
    "score" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "RawShiftEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RawShiftVote" (
    "id" UUID NOT NULL,
    "entryId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RawShiftVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RawShiftComment" (
    "id" UUID NOT NULL,
    "battleId" UUID,
    "entryId" UUID,
    "userId" UUID NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RawShiftComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "targetType" "ReportType" NOT NULL,
    "targetId" UUID NOT NULL,
    "description" TEXT,
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
    "profileType" "Type" NOT NULL DEFAULT 'SIM_RACING_DRIVER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SimRacingProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SplitScreenMatchRequest" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "carId" UUID NOT NULL,
    "league" "SplitScreenLeagueCode" NOT NULL,
    "division" "SplitScreenDivision" NOT NULL,
    "matchmakingMode" "SplitScreenMatchmakingMode" NOT NULL DEFAULT 'ANYONE',
    "preferenceMode" "SplitScreenPreferenceMode" NOT NULL DEFAULT 'ANY_CAR_BRAND',
    "preferredBrand" TEXT,
    "battleCategory" "SplitScreenBattleCategory" NOT NULL,
    "prestigePoint" INTEGER,
    "status" "SplitScreenMatchStatus" NOT NULL DEFAULT 'SEARCHING',
    "matchedBattleId" UUID,
    "expiresAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "matchedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SplitScreenMatchRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SplitScreenBattle" (
    "id" UUID NOT NULL,
    "league" "SplitScreenLeagueCode" NOT NULL,
    "division" "SplitScreenDivision" NOT NULL,
    "category" "SplitScreenBattleCategory" NOT NULL,
    "matchmakingMode" "SplitScreenMatchmakingMode" NOT NULL DEFAULT 'ANYONE',
    "preferenceMode" "SplitScreenPreferenceMode" NOT NULL DEFAULT 'ANY_CAR_BRAND',
    "preferredBrand" TEXT,
    "leftUserId" UUID NOT NULL,
    "leftProfileId" UUID NOT NULL,
    "leftCarId" UUID NOT NULL,
    "rightUserId" UUID NOT NULL,
    "rightProfileId" UUID NOT NULL,
    "rightCarId" UUID NOT NULL,
    "leftRequestId" UUID,
    "rightRequestId" UUID,
    "status" "SplitScreenBattleStatus" NOT NULL DEFAULT 'LIVE',
    "totalVotes" INTEGER NOT NULL DEFAULT 0,
    "leftVotes" INTEGER NOT NULL DEFAULT 0,
    "rightVotes" INTEGER NOT NULL DEFAULT 0,
    "entryPrestige" INTEGER NOT NULL DEFAULT 300,
    "prizePool" INTEGER NOT NULL DEFAULT 450,
    "winnerSide" "SplitScreenVoteType",
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SplitScreenBattle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SplitScreenBattleParticipant" (
    "id" UUID NOT NULL,
    "battleId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "carId" UUID NOT NULL,
    "side" "SplitScreenVoteType" NOT NULL,
    "votes" INTEGER NOT NULL DEFAULT 0,
    "result" "SplitScreenParticipantResult",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SplitScreenBattleParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SplitScreenBattleVote" (
    "id" UUID NOT NULL,
    "battleId" UUID NOT NULL,
    "voterId" UUID NOT NULL,
    "vote" "SplitScreenVoteType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SplitScreenBattleVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpotterProfile" (
    "id" UUID NOT NULL,
    "profileType" "Type" NOT NULL DEFAULT 'SPOTTER',
    "profileId" UUID NOT NULL,

    CONSTRAINT "SpotterProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmitLabTime" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "simPlatform" "Platform" NOT NULL DEFAULT 'iRacing',
    "circuit" "Circuit" NOT NULL DEFAULT 'Spa_Francorchamps',
    "carName" TEXT,
    "carClass" "CarClass" NOT NULL DEFAULT 'DRIFT',
    "lapTimeMs" INTEGER NOT NULL,
    "sessionDate" TIMESTAMPTZ(6) NOT NULL,
    "videoLink" VARCHAR(500),
    "telemetrySource" "TelemetrySource" NOT NULL DEFAULT 'iRacing_MoTec',
    "telemetryData" TEXT,
    "tractionControl" BOOLEAN NOT NULL DEFAULT false,
    "abs" BOOLEAN NOT NULL DEFAULT false,
    "stability" BOOLEAN NOT NULL DEFAULT false,
    "autoClutch" BOOLEAN NOT NULL DEFAULT false,
    "racingLine" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "SubmitLabTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TuningAero" (
    "id" UUID NOT NULL,
    "advancedCarDataId" UUID NOT NULL,
    "ecuTune" "EcuTune" NOT NULL DEFAULT 'Stock',
    "aeroDynamics" TEXT,

    CONSTRAINT "TuningAero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsageNotes" (
    "id" UUID NOT NULL,
    "advancedCarDataId" UUID NOT NULL,
    "category" "UsageCategory" NOT NULL DEFAULT 'Street',
    "driverLevel" "DriverLevel" NOT NULL DEFAULT 'Amateur',
    "usageMode" "UsageMode" NOT NULL DEFAULT 'Daily',
    "alignmentNotes" TEXT,

    CONSTRAINT "UsageNotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "activeRole" "Role",
    "otp" TEXT,
    "expiresIn" TEXT,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "accountStatus" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "emailOtp" TEXT,
    "emailOtpExpiresAt" TIMESTAMP(3),
    "resetOtp" TEXT,
    "resetOtpExpiresAt" TIMESTAMP(3),
    "refreshTokenHash" TEXT,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "activeProfileId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPoint" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "postId" UUID,
    "likeId" UUID,
    "commentId" UUID,
    "followId" UUID,
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
    "transmission" "Transmission" NOT NULL DEFAULT 'MANUAL',
    "notes" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "VirtualGarage_pkey" PRIMARY KEY ("id")
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
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "VirtualSimRacingEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WheelsTires" (
    "id" UUID NOT NULL,
    "advancedCarDataId" UUID NOT NULL,
    "tires" TEXT,
    "wheels" TEXT,
    "frontCamber" DOUBLE PRECISION,
    "rearCamber" DOUBLE PRECISION,
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
CREATE TABLE "_PostTaggedUsers" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_PostTaggedUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "AmbassadorProgram_userId_key" ON "AmbassadorProgram"("userId");

-- CreateIndex
CREATE INDEX "Bike_profileId_idx" ON "Bike"("profileId");

-- CreateIndex
CREATE INDEX "Bike_garageId_idx" ON "Bike"("garageId");

-- CreateIndex
CREATE INDEX "Bike_listOnMarketplace_idx" ON "Bike"("listOnMarketplace");

-- CreateIndex
CREATE INDEX "Bike_category_idx" ON "Bike"("category");

-- CreateIndex
CREATE INDEX "Bike_make_model_idx" ON "Bike"("make", "model");

-- CreateIndex
CREATE INDEX "Bike_profileId_category_idx" ON "Bike"("profileId", "category");

-- CreateIndex
CREATE UNIQUE INDEX "EngineAndPerformance_advancedBikeDataId_key" ON "EngineAndPerformance"("advancedBikeDataId");

-- CreateIndex
CREATE UNIQUE INDEX "BikeDriveTrains_advancedBikeDataId_key" ON "BikeDriveTrains"("advancedBikeDataId");

-- CreateIndex
CREATE UNIQUE INDEX "Suspension_advancedBikeDataId_key" ON "Suspension"("advancedBikeDataId");

-- CreateIndex
CREATE UNIQUE INDEX "BikeWheelTires_advancedBikeDataId_key" ON "BikeWheelTires"("advancedBikeDataId");

-- CreateIndex
CREATE UNIQUE INDEX "BikeElectronics_advancedBikeDataId_key" ON "BikeElectronics"("advancedBikeDataId");

-- CreateIndex
CREATE UNIQUE INDEX "BikeUsageAndNotes_advancedBikeDataId_key" ON "BikeUsageAndNotes"("advancedBikeDataId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessProfile_profileId_key" ON "BusinessProfile"("profileId");

-- CreateIndex
CREATE INDEX "Challenge_creatorId_idx" ON "Challenge"("creatorId");

-- CreateIndex
CREATE INDEX "Challenge_status_idx" ON "Challenge"("status");

-- CreateIndex
CREATE INDEX "ChallengeParticipant_challengeId_status_idx" ON "ChallengeParticipant"("challengeId", "status");

-- CreateIndex
CREATE INDEX "ChallengeParticipant_userId_idx" ON "ChallengeParticipant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeParticipant_challengeId_userId_key" ON "ChallengeParticipant"("challengeId", "userId");

-- CreateIndex
CREATE INDEX "ChallengeSubmission_challengeId_createdAt_idx" ON "ChallengeSubmission"("challengeId", "createdAt");

-- CreateIndex
CREATE INDEX "ChallengeSubmission_participantId_idx" ON "ChallengeSubmission"("participantId");

-- CreateIndex
CREATE INDEX "ChallengeSubmission_status_idx" ON "ChallengeSubmission"("status");

-- CreateIndex
CREATE INDEX "ChallengeSubmissionMedia_submissionId_sortOrder_idx" ON "ChallengeSubmissionMedia"("submissionId", "sortOrder");

-- CreateIndex
CREATE INDEX "ChallengeReaction_submissionId_idx" ON "ChallengeReaction"("submissionId");

-- CreateIndex
CREATE INDEX "ChallengeReaction_userId_idx" ON "ChallengeReaction"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeReaction_submissionId_userId_type_key" ON "ChallengeReaction"("submissionId", "userId", "type");

-- CreateIndex
CREATE INDEX "ChallengeVote_submissionId_idx" ON "ChallengeVote"("submissionId");

-- CreateIndex
CREATE INDEX "ChallengeVote_userId_idx" ON "ChallengeVote"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeVote_submissionId_userId_key" ON "ChallengeVote"("submissionId", "userId");

-- CreateIndex
CREATE INDEX "ChallengeComment_submissionId_createdAt_idx" ON "ChallengeComment"("submissionId", "createdAt");

-- CreateIndex
CREATE INDEX "ChallengeComment_parentId_idx" ON "ChallengeComment"("parentId");

-- CreateIndex
CREATE INDEX "ChallengeComment_userId_idx" ON "ChallengeComment"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeResult_challengeId_key" ON "ChallengeResult"("challengeId");

-- CreateIndex
CREATE INDEX "ChallengeWinner_challengeId_idx" ON "ChallengeWinner"("challengeId");

-- CreateIndex
CREATE INDEX "ChallengeWinner_resultId_idx" ON "ChallengeWinner"("resultId");

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeWinner_challengeId_position_key" ON "ChallengeWinner"("challengeId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "ChassisBrakes_advancedCarDataId_key" ON "ChassisBrakes"("advancedCarDataId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentCreatorProfile_profileId_key" ON "ContentCreatorProfile"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_lastMessageId_key" ON "Conversation"("lastMessageId");

-- CreateIndex
CREATE INDEX "ConversationParticipant_userId_idx" ON "ConversationParticipant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ConversationParticipant_conversationId_userId_key" ON "ConversationParticipant"("conversationId", "userId");

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
CREATE INDEX "HeadToHeadBattle_creatorId_idx" ON "HeadToHeadBattle"("creatorId");

-- CreateIndex
CREATE INDEX "HeadToHeadBattle_status_idx" ON "HeadToHeadBattle"("status");

-- CreateIndex
CREATE INDEX "HeadToHeadBattle_accessType_idx" ON "HeadToHeadBattle"("accessType");

-- CreateIndex
CREATE INDEX "BattleParticipant_userId_idx" ON "BattleParticipant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BattleParticipant_battleId_userId_key" ON "BattleParticipant"("battleId", "userId");

-- CreateIndex
CREATE INDEX "BattleInvitation_inviterId_idx" ON "BattleInvitation"("inviterId");

-- CreateIndex
CREATE INDEX "BattleInvitation_inviteeId_idx" ON "BattleInvitation"("inviteeId");

-- CreateIndex
CREATE UNIQUE INDEX "BattleInvitation_battleId_inviteeId_key" ON "BattleInvitation"("battleId", "inviteeId");

-- CreateIndex
CREATE INDEX "BattleSubmission_battleId_idx" ON "BattleSubmission"("battleId");

-- CreateIndex
CREATE UNIQUE INDEX "BattleSubmission_battleId_userId_key" ON "BattleSubmission"("battleId", "userId");

-- CreateIndex
CREATE INDEX "BattleVote_battleId_idx" ON "BattleVote"("battleId");

-- CreateIndex
CREATE INDEX "BattleVote_userId_idx" ON "BattleVote"("userId");

-- CreateIndex
CREATE INDEX "BattleVote_submissionId_idx" ON "BattleVote"("submissionId");

-- CreateIndex
CREATE UNIQUE INDEX "BattleVote_submissionId_userId_key" ON "BattleVote"("submissionId", "userId");

-- CreateIndex
CREATE INDEX "BattleComment_battleId_idx" ON "BattleComment"("battleId");

-- CreateIndex
CREATE INDEX "BattleComment_submissionId_idx" ON "BattleComment"("submissionId");

-- CreateIndex
CREATE INDEX "BattleComment_userId_idx" ON "BattleComment"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "HidePost_userId_postId_key" ON "HidePost"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "InteriorSafety_advancedCarDataId_key" ON "InteriorSafety"("advancedCarDataId");

-- CreateIndex
CREATE INDEX "LabTime_profileId_idx" ON "LabTime"("profileId");

-- CreateIndex
CREATE INDEX "LabTime_trackName_idx" ON "LabTime"("trackName");

-- CreateIndex
CREATE INDEX "LabTime_trackName_lapTimeMs_idx" ON "LabTime"("trackName", "lapTimeMs");

-- CreateIndex
CREATE INDEX "LabTime_dateSet_idx" ON "LabTime"("dateSet");

-- CreateIndex
CREATE INDEX "LabTime_sessionType_idx" ON "LabTime"("sessionType");

-- CreateIndex
CREATE INDEX "LabTime_weather_idx" ON "LabTime"("weather");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_postId_postType_key" ON "Like"("userId", "postId", "postType");

-- CreateIndex
CREATE INDEX "Message_conversationId_createdAt_idx" ON "Message"("conversationId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Message_conversationId_senderId_clientMsgId_key" ON "Message"("conversationId", "senderId", "clientMsgId");

-- CreateIndex
CREATE INDEX "MessageReceipt_userId_status_idx" ON "MessageReceipt"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "MessageReceipt_messageId_userId_key" ON "MessageReceipt"("messageId", "userId");

-- CreateIndex
CREATE INDEX "Notification_userId_status_createdAt_idx" ON "Notification"("userId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_entityType_entityId_idx" ON "Notification"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "Notification_groupKey_idx" ON "Notification"("groupKey");

-- CreateIndex
CREATE INDEX "Notification_type_idx" ON "Notification"("type");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationPreference_userId_key" ON "NotificationPreference"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceToken_token_key" ON "DeviceToken"("token");

-- CreateIndex
CREATE INDEX "DeviceToken_userId_isActive_idx" ON "DeviceToken"("userId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "OfficialPartner_userId_key" ON "OfficialPartner"("userId");

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
CREATE INDEX "RawShiftBattle_creatorId_idx" ON "RawShiftBattle"("creatorId");

-- CreateIndex
CREATE INDEX "RawShiftBattle_status_idx" ON "RawShiftBattle"("status");

-- CreateIndex
CREATE INDEX "RawShiftBattle_startDate_idx" ON "RawShiftBattle"("startDate");

-- CreateIndex
CREATE INDEX "RawShiftBattle_endDate_idx" ON "RawShiftBattle"("endDate");

-- CreateIndex
CREATE INDEX "RawShiftParticipant_userId_idx" ON "RawShiftParticipant"("userId");

-- CreateIndex
CREATE INDEX "RawShiftParticipant_battleId_idx" ON "RawShiftParticipant"("battleId");

-- CreateIndex
CREATE UNIQUE INDEX "RawShiftParticipant_battleId_userId_key" ON "RawShiftParticipant"("battleId", "userId");

-- CreateIndex
CREATE INDEX "RawShiftEntry_battleId_idx" ON "RawShiftEntry"("battleId");

-- CreateIndex
CREATE INDEX "RawShiftEntry_userId_idx" ON "RawShiftEntry"("userId");

-- CreateIndex
CREATE INDEX "RawShiftEntry_score_idx" ON "RawShiftEntry"("score");

-- CreateIndex
CREATE UNIQUE INDEX "RawShiftEntry_battleId_userId_key" ON "RawShiftEntry"("battleId", "userId");

-- CreateIndex
CREATE INDEX "RawShiftVote_userId_idx" ON "RawShiftVote"("userId");

-- CreateIndex
CREATE INDEX "RawShiftVote_entryId_idx" ON "RawShiftVote"("entryId");

-- CreateIndex
CREATE UNIQUE INDEX "RawShiftVote_entryId_userId_key" ON "RawShiftVote"("entryId", "userId");

-- CreateIndex
CREATE INDEX "RawShiftComment_battleId_idx" ON "RawShiftComment"("battleId");

-- CreateIndex
CREATE INDEX "RawShiftComment_entryId_idx" ON "RawShiftComment"("entryId");

-- CreateIndex
CREATE INDEX "RawShiftComment_userId_idx" ON "RawShiftComment"("userId");

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
CREATE INDEX "SplitScreenMatchRequest_status_league_division_battleCatego_idx" ON "SplitScreenMatchRequest"("status", "league", "division", "battleCategory");

-- CreateIndex
CREATE INDEX "SplitScreenMatchRequest_userId_status_idx" ON "SplitScreenMatchRequest"("userId", "status");

-- CreateIndex
CREATE INDEX "SplitScreenMatchRequest_profileId_idx" ON "SplitScreenMatchRequest"("profileId");

-- CreateIndex
CREATE INDEX "SplitScreenMatchRequest_carId_idx" ON "SplitScreenMatchRequest"("carId");

-- CreateIndex
CREATE UNIQUE INDEX "SplitScreenBattle_leftRequestId_key" ON "SplitScreenBattle"("leftRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "SplitScreenBattle_rightRequestId_key" ON "SplitScreenBattle"("rightRequestId");

-- CreateIndex
CREATE INDEX "SplitScreenBattle_status_league_division_idx" ON "SplitScreenBattle"("status", "league", "division");

-- CreateIndex
CREATE INDEX "SplitScreenBattle_leftUserId_idx" ON "SplitScreenBattle"("leftUserId");

-- CreateIndex
CREATE INDEX "SplitScreenBattle_rightUserId_idx" ON "SplitScreenBattle"("rightUserId");

-- CreateIndex
CREATE INDEX "SplitScreenBattleParticipant_userId_idx" ON "SplitScreenBattleParticipant"("userId");

-- CreateIndex
CREATE INDEX "SplitScreenBattleParticipant_profileId_idx" ON "SplitScreenBattleParticipant"("profileId");

-- CreateIndex
CREATE INDEX "SplitScreenBattleParticipant_carId_idx" ON "SplitScreenBattleParticipant"("carId");

-- CreateIndex
CREATE UNIQUE INDEX "SplitScreenBattleParticipant_battleId_side_key" ON "SplitScreenBattleParticipant"("battleId", "side");

-- CreateIndex
CREATE INDEX "SplitScreenBattleVote_battleId_vote_idx" ON "SplitScreenBattleVote"("battleId", "vote");

-- CreateIndex
CREATE UNIQUE INDEX "SplitScreenBattleVote_battleId_voterId_key" ON "SplitScreenBattleVote"("battleId", "voterId");

-- CreateIndex
CREATE UNIQUE INDEX "SpotterProfile_profileId_key" ON "SpotterProfile"("profileId");

-- CreateIndex
CREATE INDEX "SubmitLabTime_profileId_idx" ON "SubmitLabTime"("profileId");

-- CreateIndex
CREATE INDEX "SubmitLabTime_circuit_idx" ON "SubmitLabTime"("circuit");

-- CreateIndex
CREATE INDEX "SubmitLabTime_carClass_idx" ON "SubmitLabTime"("carClass");

-- CreateIndex
CREATE INDEX "SubmitLabTime_simPlatform_idx" ON "SubmitLabTime"("simPlatform");

-- CreateIndex
CREATE INDEX "SubmitLabTime_lapTimeMs_idx" ON "SubmitLabTime"("lapTimeMs");

-- CreateIndex
CREATE INDEX "SubmitLabTime_circuit_carClass_lapTimeMs_idx" ON "SubmitLabTime"("circuit", "carClass", "lapTimeMs");

-- CreateIndex
CREATE INDEX "SubmitLabTime_profileId_circuit_idx" ON "SubmitLabTime"("profileId", "circuit");

-- CreateIndex
CREATE UNIQUE INDEX "TuningAero_advancedCarDataId_key" ON "TuningAero"("advancedCarDataId");

-- CreateIndex
CREATE UNIQUE INDEX "UsageNotes_advancedCarDataId_key" ON "UsageNotes"("advancedCarDataId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "VirtualGarage_profileId_idx" ON "VirtualGarage"("profileId");

-- CreateIndex
CREATE INDEX "VirtualGarage_simPlatform_carClass_idx" ON "VirtualGarage"("simPlatform", "carClass");

-- CreateIndex
CREATE INDEX "VirtualSimRacingEvent_profileId_idx" ON "VirtualSimRacingEvent"("profileId");

-- CreateIndex
CREATE INDEX "VirtualSimRacingEvent_simPlatform_eventType_idx" ON "VirtualSimRacingEvent"("simPlatform", "eventType");

-- CreateIndex
CREATE INDEX "VirtualSimRacingEvent_dateAndTime_idx" ON "VirtualSimRacingEvent"("dateAndTime");

-- CreateIndex
CREATE UNIQUE INDEX "WheelsTires_advancedCarDataId_key" ON "WheelsTires"("advancedCarDataId");

-- CreateIndex
CREATE UNIQUE INDEX "WishList_userId_postId_key" ON "WishList"("userId", "postId");

-- CreateIndex
CREATE INDEX "_PostHashtags_B_index" ON "_PostHashtags"("B");

-- CreateIndex
CREATE INDEX "_PostTaggedUsers_B_index" ON "_PostTaggedUsers"("B");

-- AddForeignKey
ALTER TABLE "AdvancedCarData" ADD CONSTRAINT "AdvancedCarData_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmbassadorProgram" ADD CONSTRAINT "AmbassadorProgram_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bike" ADD CONSTRAINT "Bike_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bike" ADD CONSTRAINT "Bike_garageId_fkey" FOREIGN KEY ("garageId") REFERENCES "Garage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdvancedBikeData" ADD CONSTRAINT "AdvancedBikeData_bikeId_fkey" FOREIGN KEY ("bikeId") REFERENCES "Bike"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EngineAndPerformance" ADD CONSTRAINT "EngineAndPerformance_advancedBikeDataId_fkey" FOREIGN KEY ("advancedBikeDataId") REFERENCES "AdvancedBikeData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BikeDriveTrains" ADD CONSTRAINT "BikeDriveTrains_advancedBikeDataId_fkey" FOREIGN KEY ("advancedBikeDataId") REFERENCES "AdvancedBikeData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Suspension" ADD CONSTRAINT "Suspension_advancedBikeDataId_fkey" FOREIGN KEY ("advancedBikeDataId") REFERENCES "AdvancedBikeData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BikeWheelTires" ADD CONSTRAINT "BikeWheelTires_advancedBikeDataId_fkey" FOREIGN KEY ("advancedBikeDataId") REFERENCES "AdvancedBikeData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BikeElectronics" ADD CONSTRAINT "BikeElectronics_advancedBikeDataId_fkey" FOREIGN KEY ("advancedBikeDataId") REFERENCES "AdvancedBikeData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BikeUsageAndNotes" ADD CONSTRAINT "BikeUsageAndNotes_advancedBikeDataId_fkey" FOREIGN KEY ("advancedBikeDataId") REFERENCES "AdvancedBikeData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessProfile" ADD CONSTRAINT "BusinessProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_garageId_fkey" FOREIGN KEY ("garageId") REFERENCES "Garage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeParticipant" ADD CONSTRAINT "ChallengeParticipant_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeParticipant" ADD CONSTRAINT "ChallengeParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeSubmission" ADD CONSTRAINT "ChallengeSubmission_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeSubmission" ADD CONSTRAINT "ChallengeSubmission_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "ChallengeParticipant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeSubmissionMedia" ADD CONSTRAINT "ChallengeSubmissionMedia_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "ChallengeSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeReaction" ADD CONSTRAINT "ChallengeReaction_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "ChallengeSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeReaction" ADD CONSTRAINT "ChallengeReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeVote" ADD CONSTRAINT "ChallengeVote_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "ChallengeSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeVote" ADD CONSTRAINT "ChallengeVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeComment" ADD CONSTRAINT "ChallengeComment_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "ChallengeSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeComment" ADD CONSTRAINT "ChallengeComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeComment" ADD CONSTRAINT "ChallengeComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ChallengeComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeResult" ADD CONSTRAINT "ChallengeResult_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeWinner" ADD CONSTRAINT "ChallengeWinner_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "ChallengeResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeWinner" ADD CONSTRAINT "ChallengeWinner_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeWinner" ADD CONSTRAINT "ChallengeWinner_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "ChallengeParticipant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeWinner" ADD CONSTRAINT "ChallengeWinner_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "ChallengeSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChassisBrakes" ADD CONSTRAINT "ChassisBrakes_advancedCarDataId_fkey" FOREIGN KEY ("advancedCarDataId") REFERENCES "AdvancedCarData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentCreatorProfile" ADD CONSTRAINT "ContentCreatorProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_lastMessageId_fkey" FOREIGN KEY ("lastMessageId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisplayAndPcSetup" ADD CONSTRAINT "DisplayAndPcSetup_simRacingId_fkey" FOREIGN KEY ("simRacingId") REFERENCES "SimRacingProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drivetrain" ADD CONSTRAINT "Drivetrain_advancedCarDataId_fkey" FOREIGN KEY ("advancedCarDataId") REFERENCES "AdvancedCarData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DrivingAssistant" ADD CONSTRAINT "DrivingAssistant_simRacingId_fkey" FOREIGN KEY ("simRacingId") REFERENCES "SimRacingProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnginePower" ADD CONSTRAINT "EnginePower_advancedCarDataId_fkey" FOREIGN KEY ("advancedCarDataId") REFERENCES "AdvancedCarData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Garage" ADD CONSTRAINT "Garage_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HardwareSetup" ADD CONSTRAINT "HardwareSetup_simRacingId_fkey" FOREIGN KEY ("simRacingId") REFERENCES "SimRacingProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeadToHeadBattle" ADD CONSTRAINT "HeadToHeadBattle_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeadToHeadBattle" ADD CONSTRAINT "HeadToHeadBattle_winnerUserId_fkey" FOREIGN KEY ("winnerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleParticipant" ADD CONSTRAINT "BattleParticipant_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "HeadToHeadBattle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleParticipant" ADD CONSTRAINT "BattleParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleInvitation" ADD CONSTRAINT "BattleInvitation_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "HeadToHeadBattle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleInvitation" ADD CONSTRAINT "BattleInvitation_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleInvitation" ADD CONSTRAINT "BattleInvitation_inviteeId_fkey" FOREIGN KEY ("inviteeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleSubmission" ADD CONSTRAINT "BattleSubmission_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "HeadToHeadBattle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleSubmission" ADD CONSTRAINT "BattleSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleVote" ADD CONSTRAINT "BattleVote_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "BattleSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleVote" ADD CONSTRAINT "BattleVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleVote" ADD CONSTRAINT "BattleVote_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "HeadToHeadBattle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleComment" ADD CONSTRAINT "BattleComment_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "HeadToHeadBattle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleComment" ADD CONSTRAINT "BattleComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleComment" ADD CONSTRAINT "BattleComment_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "BattleSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HidePost" ADD CONSTRAINT "HidePost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HidePost" ADD CONSTRAINT "HidePost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InteriorSafety" ADD CONSTRAINT "InteriorSafety_advancedCarDataId_fkey" FOREIGN KEY ("advancedCarDataId") REFERENCES "AdvancedCarData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabTime" ADD CONSTRAINT "LabTime_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegalNotice" ADD CONSTRAINT "LegalNotice_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegalNotice" ADD CONSTRAINT "LegalNotice_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegalNotice" ADD CONSTRAINT "LegalNotice_bikeId_fkey" FOREIGN KEY ("bikeId") REFERENCES "Bike"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageReceipt" ADD CONSTRAINT "MessageReceipt_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageReceipt" ADD CONSTRAINT "MessageReceipt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceToken" ADD CONSTRAINT "DeviceToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfficialPartner" ADD CONSTRAINT "OfficialPartner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnerProfile" ADD CONSTRAINT "OwnerProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prize" ADD CONSTRAINT "Prize_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProDriverProfile" ADD CONSTRAINT "ProDriverProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductList" ADD CONSTRAINT "ProductList_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Racing" ADD CONSTRAINT "Racing_simRacingId_fkey" FOREIGN KEY ("simRacingId") REFERENCES "SimRacingProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RacingVote" ADD CONSTRAINT "RacingVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RacingVote" ADD CONSTRAINT "RacingVote_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawShiftBattle" ADD CONSTRAINT "RawShiftBattle_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawShiftBattle" ADD CONSTRAINT "RawShiftBattle_winnerUserId_fkey" FOREIGN KEY ("winnerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawShiftParticipant" ADD CONSTRAINT "RawShiftParticipant_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "RawShiftBattle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawShiftParticipant" ADD CONSTRAINT "RawShiftParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawShiftEntry" ADD CONSTRAINT "RawShiftEntry_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "RawShiftBattle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawShiftEntry" ADD CONSTRAINT "RawShiftEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawShiftVote" ADD CONSTRAINT "RawShiftVote_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "RawShiftEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawShiftVote" ADD CONSTRAINT "RawShiftVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawShiftComment" ADD CONSTRAINT "RawShiftComment_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "RawShiftBattle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawShiftComment" ADD CONSTRAINT "RawShiftComment_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "RawShiftEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawShiftComment" ADD CONSTRAINT "RawShiftComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "SplitScreenMatchRequest" ADD CONSTRAINT "SplitScreenMatchRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenMatchRequest" ADD CONSTRAINT "SplitScreenMatchRequest_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenMatchRequest" ADD CONSTRAINT "SplitScreenMatchRequest_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenMatchRequest" ADD CONSTRAINT "SplitScreenMatchRequest_matchedBattleId_fkey" FOREIGN KEY ("matchedBattleId") REFERENCES "SplitScreenBattle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenBattle" ADD CONSTRAINT "SplitScreenBattle_leftUserId_fkey" FOREIGN KEY ("leftUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenBattle" ADD CONSTRAINT "SplitScreenBattle_leftProfileId_fkey" FOREIGN KEY ("leftProfileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenBattle" ADD CONSTRAINT "SplitScreenBattle_leftCarId_fkey" FOREIGN KEY ("leftCarId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenBattle" ADD CONSTRAINT "SplitScreenBattle_rightUserId_fkey" FOREIGN KEY ("rightUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenBattle" ADD CONSTRAINT "SplitScreenBattle_rightProfileId_fkey" FOREIGN KEY ("rightProfileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenBattle" ADD CONSTRAINT "SplitScreenBattle_rightCarId_fkey" FOREIGN KEY ("rightCarId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenBattle" ADD CONSTRAINT "SplitScreenBattle_leftRequestId_fkey" FOREIGN KEY ("leftRequestId") REFERENCES "SplitScreenMatchRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenBattle" ADD CONSTRAINT "SplitScreenBattle_rightRequestId_fkey" FOREIGN KEY ("rightRequestId") REFERENCES "SplitScreenMatchRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenBattleParticipant" ADD CONSTRAINT "SplitScreenBattleParticipant_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "SplitScreenBattle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenBattleParticipant" ADD CONSTRAINT "SplitScreenBattleParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenBattleParticipant" ADD CONSTRAINT "SplitScreenBattleParticipant_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenBattleParticipant" ADD CONSTRAINT "SplitScreenBattleParticipant_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenBattleVote" ADD CONSTRAINT "SplitScreenBattleVote_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "SplitScreenBattle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitScreenBattleVote" ADD CONSTRAINT "SplitScreenBattleVote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpotterProfile" ADD CONSTRAINT "SpotterProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmitLabTime" ADD CONSTRAINT "SubmitLabTime_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TuningAero" ADD CONSTRAINT "TuningAero_advancedCarDataId_fkey" FOREIGN KEY ("advancedCarDataId") REFERENCES "AdvancedCarData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageNotes" ADD CONSTRAINT "UsageNotes_advancedCarDataId_fkey" FOREIGN KEY ("advancedCarDataId") REFERENCES "AdvancedCarData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPoint" ADD CONSTRAINT "UserPoint_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPoint" ADD CONSTRAINT "UserPoint_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPoint" ADD CONSTRAINT "UserPoint_likeId_fkey" FOREIGN KEY ("likeId") REFERENCES "Like"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPoint" ADD CONSTRAINT "UserPoint_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPoint" ADD CONSTRAINT "UserPoint_followId_fkey" FOREIGN KEY ("followId") REFERENCES "Follow"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualGarage" ADD CONSTRAINT "VirtualGarage_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualSimRacingEvent" ADD CONSTRAINT "VirtualSimRacingEvent_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WheelsTires" ADD CONSTRAINT "WheelsTires_advancedCarDataId_fkey" FOREIGN KEY ("advancedCarDataId") REFERENCES "AdvancedCarData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishList" ADD CONSTRAINT "WishList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishList" ADD CONSTRAINT "WishList_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostHashtags" ADD CONSTRAINT "_PostHashtags_A_fkey" FOREIGN KEY ("A") REFERENCES "Hashtag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostHashtags" ADD CONSTRAINT "_PostHashtags_B_fkey" FOREIGN KEY ("B") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostTaggedUsers" ADD CONSTRAINT "_PostTaggedUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostTaggedUsers" ADD CONSTRAINT "_PostTaggedUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
