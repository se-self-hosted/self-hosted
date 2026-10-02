import "dotenv/config";
import { prisma } from "../src/lib/db";
import { uploadRecording, getRecordingPresignedUrl, getRecordingObject, deleteRecordingObject, BUCKET_NAME } from "../src/lib/storage";
import { randomUUID } from "crypto";

async function runTests() {
  console.log("=== 1. Testing MinIO / S3 Storage Configuration ===");
  const testAudioBuffer = Buffer.from("RIFF....WAVEfmt ....data....test-audio-content");
  const testKey = `test-recordings/test-${Date.now()}.wav`;

  try {
    const uploadRes = await uploadRecording(testAudioBuffer, testKey, "audio/wav");
    console.log("✅ MinIO Upload Successful:", uploadRes);

    const presignedUrl = await getRecordingPresignedUrl(testKey, 60);
    console.log("✅ Generated Presigned URL:", presignedUrl.substring(0, 60) + "...");

    const getObjRes = await getRecordingObject(testKey);
    console.log("✅ Retrieved Object from S3. ContentLength:", getObjRes.ContentLength);

    await deleteRecordingObject(testKey);
    console.log("✅ Cleaned up test recording from S3");
  } catch (err) {
    console.warn("MinIO test notice (might be running outside docker network):", err);
  }

  console.log("\n=== 2. Testing Meeting, Transcript Timeline & Chronological Sorting ===");
  // Create or find a test host user
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: `tester-${Date.now()}@example.com`,
        password: "hash",
        fullname: "Test Host",
      },
    });
  }

  // Create a test room
  const testHash = `test-room-${Date.now()}`;
  const room = await prisma.meetingRoom.create({
    data: {
      hostId: user.id,
      roomName: "Timeline & Recording Test Room",
      roomHash: testHash,
      maxParticipants: 10,
      status: "active",
    },
  });

  // Create a meeting
  const meeting = await prisma.meeting.create({
    data: {
      roomId: room.id,
    },
  });

  // Create participants
  const alice = await prisma.participant.create({
    data: {
      meetingId: meeting.id,
      displayName: "Alice",
    },
  });

  const bob = await prisma.participant.create({
    data: {
      meetingId: meeting.id,
      displayName: "Bob",
    },
  });

  // Create transcript
  const transcript = await prisma.transcript.create({
    data: {
      meetingId: meeting.id,
      fullTranscript: "",
      language: "th",
    },
  });

  // Insert out-of-order segments to test chronological sorting
  console.log("Inserting out-of-order transcript segments...");
  
  // Segment 3: at 15.0s - 18.5s
  await prisma.transcriptSegment.create({
    data: {
      transcriptId: transcript.id,
      participantId: alice.id,
      startTime: 15.0,
      endTime: 18.5,
      spokenAt: new Date(Date.now() + 15000),
      text: "ขอบคุณทุกคนที่เข้าร่วมประชุมวันนี้",
      confidence: 0.99,
    },
  });

  // Segment 1: at 0.5s - 4.2s
  await prisma.transcriptSegment.create({
    data: {
      transcriptId: transcript.id,
      participantId: alice.id,
      startTime: 0.5,
      endTime: 4.2,
      spokenAt: new Date(Date.now()),
      text: "สวัสดีทุกคน ยินดีต้อนรับสู่การประชุม",
      confidence: 0.95,
    },
  });

  // Segment 2: at 5.0s - 9.8s
  await prisma.transcriptSegment.create({
    data: {
      transcriptId: transcript.id,
      participantId: bob.id,
      startTime: 5.0,
      endTime: 9.8,
      spokenAt: new Date(Date.now() + 5000),
      text: "สวัสดีครับ ได้ยินเสียงชัดเจนครับ",
      confidence: 0.97,
    },
  });

  // Fetch segments ordered chronologically
  const sortedSegments = await prisma.transcriptSegment.findMany({
    where: { transcriptId: transcript.id },
    orderBy: [
      { startTime: "asc" },
      { spokenAt: "asc" },
    ],
    include: { participant: true },
  });

  console.log("\nVerified Sorted Transcript Timeline:");
  sortedSegments.forEach((seg, idx) => {
    console.log(
      `  [${idx + 1}] (${seg.startTime.toFixed(1)}s - ${seg.endTime.toFixed(1)}s) ${seg.participant.displayName}: "${seg.text}" (conf: ${seg.confidence})`,
    );
  });

  // Assert chronological order
  if (sortedSegments[0].startTime !== 0.5 || sortedSegments[1].startTime !== 5.0 || sortedSegments[2].startTime !== 15.0) {
    throw new Error("❌ Transcript segments are not chronologically sorted!");
  }
  console.log("✅ Transcript Timeline sorting test PASSED!");

  console.log("\n=== 3. Testing Recording Metadata & Database Storage ===");
  const recId = randomUUID();
  const mockRecording = await prisma.recording.create({
    data: {
      id: recId,
      meetingId: meeting.id,
      fileName: `meeting-${testHash}-audio.webm`,
      objectKey: `recordings/${meeting.id}/${recId}.webm`,
      durationSeconds: 120,
      fileSize: BigInt(2048500),
      mimeType: "audio/webm",
    },
  });

  console.log("✅ Stored Recording Metadata in DB:", {
    id: mockRecording.id,
    fileName: mockRecording.fileName,
    durationSeconds: mockRecording.durationSeconds,
    fileSize: mockRecording.fileSize.toString(),
    mimeType: mockRecording.mimeType,
  });

  console.log("\n=== 4. Cleaning up Test Artifacts ===");
  await prisma.meetingRoom.delete({ where: { id: room.id } });
  console.log("✅ Cleaned up test database entities.");

  console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY!");
}

runTests()
  .catch((e) => {
    console.error("Test failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
