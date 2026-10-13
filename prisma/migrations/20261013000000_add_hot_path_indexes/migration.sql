-- CreateIndex
CREATE INDEX "MeetingRoom_hostId_createdAt_idx" ON "MeetingRoom"("hostId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Meeting_roomId_endedAt_startedAt_idx" ON "Meeting"("roomId", "endedAt", "startedAt" DESC);

-- CreateIndex
CREATE INDEX "Participant_meetingId_userId_idx" ON "Participant"("meetingId", "userId");

-- CreateIndex
CREATE INDEX "ParticipantSession_connectionId_idx" ON "ParticipantSession"("connectionId");

-- CreateIndex
CREATE INDEX "ParticipantSession_participantId_leftAt_lastSeenAt_idx" ON "ParticipantSession"("participantId", "leftAt", "lastSeenAt");

-- CreateIndex
CREATE INDEX "TranscriptSegment_transcriptId_startTime_spokenAt_idx" ON "TranscriptSegment"("transcriptId", "startTime", "spokenAt");

-- CreateIndex
CREATE INDEX "TranscriptSegment_participantId_idx" ON "TranscriptSegment"("participantId");

-- CreateIndex
CREATE INDEX "Recording_meetingId_createdAt_idx" ON "Recording"("meetingId", "createdAt");

-- CreateIndex
CREATE INDEX "Export_meetingId_idx" ON "Export"("meetingId");

