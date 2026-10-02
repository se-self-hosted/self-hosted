import "dotenv/config";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/db";
import { signJwtToken } from "../src/lib/auth";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

async function runTests() {
  console.log("Starting Summary Edit (FR-15) Tests...");

  const host = await prisma.user.upsert({
    where: { email: "test_summary_edit_host@example.com" },
    update: {},
    create: {
      email: "test_summary_edit_host@example.com",
      password: await bcrypt.hash("password123", 10),
      fullname: "Summary Edit Host",
    },
  });
  const other = await prisma.user.upsert({
    where: { email: "test_summary_edit_other@example.com" },
    update: {},
    create: {
      email: "test_summary_edit_other@example.com",
      password: await bcrypt.hash("password123", 10),
      fullname: "Not The Host",
    },
  });
  const hostCookie = `auth_token=${await signJwtToken({ sub: host.id, email: host.email })}`;
  const otherCookie = `auth_token=${await signJwtToken({ sub: other.id, email: other.email })}`;

  const room = await prisma.meetingRoom.upsert({
    where: { roomHash: "testsummaryedithash" },
    update: {},
    create: { hostId: host.id, roomName: "Summary Edit Room", roomHash: "testsummaryedithash", maxParticipants: 10, status: "idle" },
  });
  const meeting = await prisma.meeting.create({ data: { roomId: room.id } });
  const emptyMeeting = await prisma.meeting.create({ data: { roomId: room.id } });
  const generated = await prisma.meetingSummary.create({
    data: { meetingId: meeting.id, aiSummary: "## สรุป\n- AI version", llmModel: "gpt-4o-mini", generatedAt: new Date() },
  });

  const patch = (meetingId: string, body: unknown, cookie = hostCookie) =>
    fetch(`${BASE_URL}/api/meetings/${meetingId}/summary`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: typeof body === "string" ? body : JSON.stringify(body),
    });
  const base = (summary: { generatedAt: Date | string; editedAt: Date | string | null }) => ({
    baseGeneratedAt: new Date(summary.generatedAt).toISOString(),
    baseEditedAt: summary.editedAt === null ? null : new Date(summary.editedAt).toISOString(),
  });

  try {
    // Access control
    assert.equal((await patch(meeting.id, { editedSummary: "x", ...base(generated) }, "")).status, 403);
    assert.equal((await patch(meeting.id, { editedSummary: "x", ...base(generated) }, otherCookie)).status, 403);
    assert.equal((await patch("no-such-meeting", { editedSummary: "x", ...base(generated) })).status, 404);
    console.log("✅ Only the host can edit");

    // Validation
    assert.equal((await patch(meeting.id, "{not json")).status, 400);
    assert.equal((await patch(meeting.id, { editedSummary: "x" })).status, 400);
    const empty = await patch(meeting.id, { editedSummary: "  \n ", ...base(generated) });
    assert.equal(empty.status, 422);
    assert.equal((await empty.json()).code, "SUMMARY_EMPTY");
    const tooLong = await patch(meeting.id, { editedSummary: "a".repeat(20_001), ...base(generated) });
    assert.equal((await tooLong.json()).code, "SUMMARY_TOO_LONG");
    const noSummary = await patch(emptyMeeting.id, { editedSummary: "x", ...base(generated) });
    assert.equal(noSummary.status, 404);
    assert.equal((await noSummary.json()).code, "SUMMARY_NOT_FOUND");
    console.log("✅ Invalid edits are rejected");

    // Save an edit
    const saveRes = await patch(meeting.id, { editedSummary: "  ## สรุป\r\n- Edited version  ", ...base(generated) });
    assert.equal(saveRes.status, 200);
    const { summary: edited } = await saveRes.json();
    assert.equal(edited.editedSummary, "## สรุป\n- Edited version");
    assert.equal(edited.aiSummary, generated.aiSummary);
    assert.ok(edited.editedAt);
    console.log("✅ Edit saved and normalized");

    // A save based on the pre-edit version is now stale
    const stale = await patch(meeting.id, { editedSummary: "Stale tab", ...base(generated) });
    assert.equal(stale.status, 409);
    assert.equal((await stale.json()).code, "SUMMARY_CONFLICT");
    const afterStale = await prisma.meetingSummary.findUniqueOrThrow({ where: { meetingId: meeting.id } });
    assert.equal(afterStale.editedSummary, "## สรุป\n- Edited version");
    console.log("✅ Stale edit refused without overwriting");

    // Editing back to the AI text clears the edit
    const sameAsAi = await (await patch(meeting.id, { editedSummary: generated.aiSummary, ...base(edited) })).json();
    assert.equal(sameAsAi.summary.editedSummary, null);
    assert.equal(sameAsAi.summary.editedAt, null);
    console.log("✅ Text identical to the AI version is not marked as edited");

    // Revert explicitly
    const reEdited = await (await patch(meeting.id, { editedSummary: "Second edit", ...base(sameAsAi.summary) })).json();
    assert.equal(reEdited.summary.editedSummary, "Second edit");
    const reverted = await (await patch(meeting.id, { editedSummary: null, ...base(reEdited.summary) })).json();
    assert.equal(reverted.summary.editedSummary, null);
    assert.equal(reverted.summary.aiSummary, generated.aiSummary);
    console.log("✅ Revert to AI version");

    // The meeting detail API shows the saved edit
    await patch(meeting.id, { editedSummary: "Final edit", ...base(reverted.summary) });
    const detail = await (await fetch(`${BASE_URL}/api/meetings/${meeting.id}`, { headers: { Cookie: hostCookie } })).json();
    assert.equal(detail.meeting.summary.editedSummary, "Final edit");
    console.log("✅ Meeting detail returns the edited summary");

    console.log("All summary edit tests passed!");
  } finally {
    await prisma.meeting.deleteMany({ where: { id: { in: [meeting.id, emptyMeeting.id] } } });
  }
}

runTests()
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
