-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BattleCategory" ADD VALUE 'DRIFT_BATTLE';
ALTER TYPE "BattleCategory" ADD VALUE 'CLEAN_BUILD_BATTLE';
ALTER TYPE "BattleCategory" ADD VALUE 'SLEEPER_BATTLE';
ALTER TYPE "BattleCategory" ADD VALUE 'SOUND_BATTLE';
ALTER TYPE "BattleCategory" ADD VALUE 'WHEELS_BATTLE';
ALTER TYPE "BattleCategory" ADD VALUE 'ENGINE_BAY_BATTLE';
ALTER TYPE "BattleCategory" ADD VALUE 'STREET_VS_TRACK_BATTLE';
ALTER TYPE "BattleCategory" ADD VALUE 'DAILY_HERO_BATTLE';
ALTER TYPE "BattleCategory" ADD VALUE 'YOUNGTIMER_BATTLE';
ALTER TYPE "BattleCategory" ADD VALUE 'SUPER_HYPERCAR_BATTLE';
ALTER TYPE "BattleCategory" ADD VALUE 'BRAND_CLASH_BATTLE';
ALTER TYPE "BattleCategory" ADD VALUE 'SIXTIES_ERA_BATTLE';
ALTER TYPE "BattleCategory" ADD VALUE 'SEVENTIES_ERA_BATTLE';
ALTER TYPE "BattleCategory" ADD VALUE 'EIGHTIES_ERA_BATTLE';
ALTER TYPE "BattleCategory" ADD VALUE 'NINTIES_ERA_BATTLE';
ALTER TYPE "BattleCategory" ADD VALUE 'TWENTIES_ERA_BATTLE';
ALTER TYPE "BattleCategory" ADD VALUE 'NIGHT_THEME_BATTLE';
ALTER TYPE "BattleCategory" ADD VALUE 'FUNNY_CAR_MOMENT';
ALTER TYPE "BattleCategory" ADD VALUE 'OTHER';
