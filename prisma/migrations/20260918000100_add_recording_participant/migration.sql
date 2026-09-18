-- AlterTable
ALTER TABLE "Recording" ADD COLUMN "participantId" TEXT;

-- CreateIndex
CREATE INDEX "Recording_participantId_idx" ON "Recording"("participantId");

-- AddForeignKey
ALTER TABLE "Recording" ADD CONSTRAINT "Recording_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
