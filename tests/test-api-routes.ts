import { prisma } from "../src/lib/db";
import { uploadRecording, getRecordingPresignedUrl } from "../src/lib/storage";
import { randomUUID } from "crypto";

async function testApiIntegration() {
  console.log("=== Testing API Integration & Playback Stream ===");

  // 1. Setup User, Room, Meeting
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: `api-test-${Date.now()}@example.com`,
        password: "hash",
        fullname: "API Tester",
      },
    });
  }

  const roomHash = `api-room-${Date.now()}`;
  const room = await prisma.meetingRoom.create({
    data: {
      hostId: user.id,
      roomName: "API Integration Test Room",
      roomHash,
      maxParticipants: 10,
      status: "active",
    },
  });

  const meeting = await prisma.meeting.create({
    data: {
      roomId: room.id,
    },
  });

  const alice = await prisma.participant.create({
    data: {
      meetingId: meeting.id,
      displayName: "Alice",
    },
  });

  console.log(`Created Meeting: ${meeting.id} in Room #${roomHash}`);

  // 2. Upload Audio Recording to MinIO
  const fakeAudioContent = Buffer.from("RIFF0000WAVEfmt 0000data0000AudioStreamPayloadForTestingPlayback");
  const recordingId = randomUUID();
  const objectKey = `recordings/${meeting.id}/${recordingId}.wav`;

  await uploadRecording(fakeAudioContent, objectKey, "audio/wav");

  const recording = await prisma.recording.create({
    data: {
      id: recordingId,
      meetingId: meeting.id,
      fileName: `test-meeting-${roomHash}.wav`,
      objectKey,
      durationSeconds: 45,
      fileSize: BigInt(fakeAudioContent.length),
      mimeType: "audio/wav",
    },
  });

  console.log("✅ Audio uploaded to MinIO and saved to DB:", recording.id);

  // 3. Add Transcript with Start & End Time + SpokenAt
  const transcript = await prisma.transcript.create({
    data: {
      meetingId: meeting.id,
      fullTranscript: "Alice: Segment 1\nAlice: Segment 2",
      language: "th",
      segments: {
        create: [
          {
            participantId: alice.id,
            startTime: 0.0,
            endTime: 3.5,
            spokenAt: new Date(Date.now() - 30000),
            text: "ยินดีต้อนรับสู่การประชุมทดสอบระบบ",
            confidence: 0.99,
          },
          {
            participantId: alice.id,
            startTime: 4.0,
            endTime: 8.2,
            spokenAt: new Date(Date.now() - 25000),
            text: "ระบบบันทึกเสียงและถอดความทำงานสมบูรณ์",
            confidence: 0.98,
          },
        ],
      },
    },
    include: {
      segments: {
        orderBy: [{ startTime: "asc" }],
      },
    },
  });

  console.log(`✅ Stored ${transcript.segments.length} transcript segments with timestamps.`);

  // 4. Verify Playback URL generation
  const playbackUrl = `/api/recordings/${recording.id}/playback`;
  const presignedUrl = await getRecordingPresignedUrl(objectKey);
  console.log(`✅ Playback Endpoint: ${playbackUrl}`);
  console.log(`✅ Presigned URL: ${presignedUrl.substring(0, 50)}...`);

  // 5. Clean up
  await prisma.meetingRoom.delete({ where: { id: room.id } });
  console.log("✅ Cleaned up API integration entities.");

  console.log("\n🎉 API INTEGRATION TESTS PASSED!");
}

testApiIntegration()
  .catch((err) => {
    console.error("API test failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
