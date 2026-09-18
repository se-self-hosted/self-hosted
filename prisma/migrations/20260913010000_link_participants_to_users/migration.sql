-- Guest and historical participants remain unlinked: names do not prove identity.
ALTER TABLE "Participant" ADD COLUMN "userId" TEXT;
CREATE INDEX "Participant_userId_idx" ON "Participant"("userId");
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
