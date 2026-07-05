-- AlterEnum
ALTER TYPE "ReportType" ADD VALUE 'CHALLENGE';

-- CreateTable
CREATE TABLE "_ChallengeToReport" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_ChallengeToReport_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ChallengeToReport_B_index" ON "_ChallengeToReport"("B");

-- AddForeignKey
ALTER TABLE "_ChallengeToReport" ADD CONSTRAINT "_ChallengeToReport_A_fkey" FOREIGN KEY ("A") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChallengeToReport" ADD CONSTRAINT "_ChallengeToReport_B_fkey" FOREIGN KEY ("B") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;
