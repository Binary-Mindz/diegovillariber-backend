-- CreateEnum
CREATE TYPE "ProgramType" AS ENUM ('CHALLENGE', 'RAW_SHIFT', 'SPLIT_SCREEN', 'HEAD_TO_HEAD');

-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "programType" "ProgramType" NOT NULL DEFAULT 'CHALLENGE';

-- AlterTable
ALTER TABLE "HeadToHeadBattle" ADD COLUMN     "programType" "ProgramType" NOT NULL DEFAULT 'HEAD_TO_HEAD';

-- AlterTable
ALTER TABLE "RawShiftBattle" ADD COLUMN     "programType" "ProgramType" NOT NULL DEFAULT 'RAW_SHIFT';

-- AlterTable
ALTER TABLE "SplitScreenMatchRequest" ADD COLUMN     "programType" "ProgramType" NOT NULL DEFAULT 'SPLIT_SCREEN';
