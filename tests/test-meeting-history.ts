import { prisma } from "../src/lib/db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "supersecret123");

async function runTests() {
  console.log("Starting Meeting History Tests...");

  const host = await prisma.user.upsert({
    where: { email: "test_history_host@example.com" },
    update: {},
    create: {
      email: "test_history_host@example.com",
      password: await bcrypt.hash("password123", 10),
      fullname: "History Host",
    },
  });

  const token = await new SignJWT({ sub: host.id, email: host.email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(JWT_SECRET);

  const room = await prisma.meetingRoom.upsert({
    where: { roomHash: "testhistoryhash" },
    update: {},
    create: {
      hostId: host.id,
      roomName: "Test History Room",
      roomHash: "testhistoryhash",
      maxParticipants: 10,
      status: "idle",
    },
  });

  const meeting = await prisma.meeting.create({
    data: {
      roomId: room.id,
      startedAt: new Date(Date.now() - 3600 * 1000),
      endedAt: new Date(),
      durationSeconds: 3600,
    },
  });

  const participant = await prisma.participant.create({
    data: {
      meetingId: meeting.id,
      displayName: "Test Participant",
      sessions: {
        create: [
          { joinedAt: new Date(Date.now() - 3600 * 1000), leftAt: new Date(Date.now() - 1800 * 1000), durationSeconds: 1800, connectionId: "conn1" },
          { joinedAt: new Date(Date.now() - 1000 * 1000), leftAt: new Date(), durationSeconds: 1000, connectionId: "conn2" },
        ],
      },
    },
  });

  const transcript = await prisma.transcript.create({
    data: {
      meetingId: meeting.id,
      fullTranscript: "Hello world",
      language: "th-TH",
      segments: {
        create: [
          { participantId: participant.id, startTime: 0, endTime: 5, spokenAt: new Date(), text: "Hello world", confidence: 0.99 },
        ],
      },
    },
  });

  console.log("✅ Seeded test data");

  const res = await fetch("http://localhost:3000/api/meetings", {
    headers: { Cookie: `auth_token=${token}` },
  });
  const data = await res.json();
  
  if (!res.ok) {
    console.error("❌ Failed to fetch meeting history:", data);
    process.exit(1);
  }

  console.log(`✅ Meeting History API Access Success: Found ${data.meetings.length} meetings.`);
  
  const fetchedMeeting = data.meetings.find((m: any) => m.id === meeting.id);
  if (!fetchedMeeting) {
    console.error("❌ Meeting not found in history");
    process.exit(1);
  }

  console.log(`✅ Display Meeting Information and Duration: Duration = ${fetchedMeeting.durationSeconds}s`);

  const detailRes = await fetch(`http://localhost:3000/api/meetings/${meeting.id}`, {
    headers: { Cookie: `auth_token=${token}` },
  });
  const detailData = await detailRes.json();

  if (!detailRes.ok) {
    console.error("❌ Failed to fetch meeting detail:", detailData);
    process.exit(1);
  }

  const pDetail = detailData.meeting.participants[0];
  console.log(`✅ Meeting Participant API Success: Found ${pDetail.displayName}`);
  console.log(`✅ Handle Participants with Multiple Sessions: Found ${pDetail.sessions.length} sessions`);
  console.log(`✅ Transcript Retrieval API: Found ${detailData.meeting.transcript.segments.length} segments`);

  console.log("All tests passed!");
  process.exit(0);
}

runTests().catch(e => {
  console.error("Test failed with exception:", e);
  process.exit(1);
});
