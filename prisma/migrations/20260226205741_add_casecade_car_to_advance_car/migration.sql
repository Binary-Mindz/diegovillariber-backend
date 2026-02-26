-- DropForeignKey
ALTER TABLE "AdvancedCarData" DROP CONSTRAINT "AdvancedCarData_carId_fkey";

-- DropForeignKey
ALTER TABLE "ChassisBrakes" DROP CONSTRAINT "ChassisBrakes_advancedCarDataId_fkey";

-- DropForeignKey
ALTER TABLE "Drivetrain" DROP CONSTRAINT "Drivetrain_advancedCarDataId_fkey";

-- DropForeignKey
ALTER TABLE "EnginePower" DROP CONSTRAINT "EnginePower_advancedCarDataId_fkey";

-- DropForeignKey
ALTER TABLE "InteriorSafety" DROP CONSTRAINT "InteriorSafety_advancedCarDataId_fkey";

-- DropForeignKey
ALTER TABLE "UsageNotes" DROP CONSTRAINT "UsageNotes_advancedCarDataId_fkey";

-- DropForeignKey
ALTER TABLE "WheelsTires" DROP CONSTRAINT "WheelsTires_advancedCarDataId_fkey";

-- AddForeignKey
ALTER TABLE "AdvancedCarData" ADD CONSTRAINT "AdvancedCarData_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChassisBrakes" ADD CONSTRAINT "ChassisBrakes_advancedCarDataId_fkey" FOREIGN KEY ("advancedCarDataId") REFERENCES "AdvancedCarData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drivetrain" ADD CONSTRAINT "Drivetrain_advancedCarDataId_fkey" FOREIGN KEY ("advancedCarDataId") REFERENCES "AdvancedCarData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnginePower" ADD CONSTRAINT "EnginePower_advancedCarDataId_fkey" FOREIGN KEY ("advancedCarDataId") REFERENCES "AdvancedCarData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InteriorSafety" ADD CONSTRAINT "InteriorSafety_advancedCarDataId_fkey" FOREIGN KEY ("advancedCarDataId") REFERENCES "AdvancedCarData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageNotes" ADD CONSTRAINT "UsageNotes_advancedCarDataId_fkey" FOREIGN KEY ("advancedCarDataId") REFERENCES "AdvancedCarData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WheelsTires" ADD CONSTRAINT "WheelsTires_advancedCarDataId_fkey" FOREIGN KEY ("advancedCarDataId") REFERENCES "AdvancedCarData"("id") ON DELETE CASCADE ON UPDATE CASCADE;
