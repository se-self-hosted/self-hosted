import assert from "node:assert/strict";
import test from "node:test";
import { crc32 as nodeCrc32 } from "node:zlib";
// @ts-expect-error Node's type-stripper requires an explicit TypeScript extension.
import { createMeetingReportDocx, createZip, crc32 } from "./report-docx.ts";
// @ts-expect-error Node's type-stripper requires an explicit TypeScript extension.
import { buildMeetingReport, parseSummaryMarkdown } from "./summary.ts";

/** Reads a store-only ZIP through its central directory, as an Office reader would. */
function readZip(bytes: Uint8Array) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const end = bytes.length - 22;
  assert.equal(view.getUint32(end, true), 0x06054b50, "end of central directory");
  const count = view.getUint16(end + 10, true);
  let offset = view.getUint32(end + 16, true);
  const decoder = new TextDecoder();
  const files = new Map<string, string>();

  for (let i = 0; i < count; i++) {
    assert.equal(view.getUint32(offset, true), 0x02014b50, "central directory entry");
    const crc = view.getUint32(offset + 16, true);
    const size = view.getUint32(offset + 24, true);
    const nameLength = view.getUint16(offset + 28, true);
    const localOffset = view.getUint32(offset + 42, true);
    const name = decoder.decode(bytes.subarray(offset + 46, offset + 46 + nameLength));

    assert.equal(view.getUint32(localOffset, true), 0x04034b50, `local header of ${name}`);
    const dataStart = localOffset + 30 + view.getUint16(localOffset + 26, true) + view.getUint16(localOffset + 28, true);
    const data = bytes.subarray(dataStart, dataStart + size);
    assert.equal(nodeCrc32(data), crc, `CRC of ${name}`);
    files.set(name, decoder.decode(data));
    offset += 46 + nameLength;
  }
  return files;
}

const summary = {
  id: "summary-1",
  aiSummary: [
    "## ภาพรวม",
    "ประชุมเรื่อง **การเปิดตัว** & <แผน>",
    "บรรทัดที่สอง",
    "## Action Items",
    "- [นัท] ถามเรื่อง `budget`",
    "- [ฝน] ทำแดชบอร์ด",
    "1. first",
    "2. second",
    "",
    "Between",
    "",
    "1. again",
  ].join("\n"),
  editedSummary: null,
  llmModel: "gpt-4o-mini",
  generatedAt: "2026-09-26T09:00:00.000Z",
  editedAt: null,
};

function buildDocx() {
  const report = buildMeetingReport({
    roomName: "Weekly <Sync> & \u0007Co",
    startedAt: "2026-09-27T02:00:00.000Z",
    durationSeconds: 125,
    participantNames: ["นัท", "ฝน"],
    summary,
  });
  assert.ok(report);
  return readZip(createMeetingReportDocx(report, parseSummaryMarkdown(report.content), new Date(2026, 9, 2, 13, 5, 30)));
}

test("matches Node's CRC-32", () => {
  for (const text of ["", "a", "รายงานสรุปการประชุม", "x".repeat(10_000)]) {
    const bytes = new TextEncoder().encode(text);
    assert.equal(crc32(bytes), nodeCrc32(bytes));
  }
});

test("writes a ZIP whose entries round-trip", () => {
  const files = readZip(
    createZip([
      { name: "a.txt", data: new TextEncoder().encode("hello") },
      { name: "ไทย/ข้อความ.xml", data: new TextEncoder().encode("<x>สวัสดี</x>") },
    ]),
  );
  assert.deepEqual([...files], [["a.txt", "hello"], ["ไทย/ข้อความ.xml", "<x>สวัสดี</x>"]]);
});

test("packages the Word parts with the content types first", () => {
  const files = buildDocx();
  assert.deepEqual([...files.keys()], [
    "[Content_Types].xml",
    "_rels/.rels",
    "word/document.xml",
    "word/_rels/document.xml.rels",
    "word/styles.xml",
    "word/numbering.xml",
  ]);
  for (const part of ["/word/document.xml", "/word/styles.xml", "/word/numbering.xml"]) {
    assert.match(files.get("[Content_Types].xml")!, new RegExp(`PartName="${part}"`));
  }
  assert.match(files.get("_rels/.rels")!, /Target="word\/document.xml"/);
  assert.match(files.get("word/_rels/document.xml.rels")!, /Target="styles.xml".*Target="numbering.xml"/);
});

test("puts the title, meeting details and summary into the document", () => {
  const document = buildDocx().get("word/document.xml")!;

  assert.match(document, /<w:pStyle w:val="Title"\/><\/w:pPr><w:r><w:t xml:space="preserve">รายงานสรุปการประชุม</);
  assert.match(document, /ห้องประชุม<\/w:t>.*Weekly &lt;Sync&gt; &amp; Co</);
  assert.match(document, /ระยะเวลา<\/w:t>.*2 นาที 5 วินาที/);
  assert.match(document, /ผู้เข้าร่วม \(2 คน\)<\/w:t>.*นัท, ฝน/);
  assert.doesNotMatch(document, /\u0007/, "control characters are dropped");
  assert.match(document, /<w:pStyle w:val="Heading2"\/><\/w:pPr><w:r><w:t xml:space="preserve">ภาพรวม</);
  assert.match(document, /<w:b\/><w:bCs\/><\/w:rPr><w:t xml:space="preserve">การเปิดตัว<\/w:t><\/w:r><w:r><w:t xml:space="preserve"> &amp; &lt;แผน&gt;/);
  assert.match(document, /&lt;แผน&gt;<\/w:t><\/w:r><w:r><w:br\/><\/w:r><w:r><w:t xml:space="preserve">บรรทัดที่สอง/);
  assert.match(document, /w:ascii="Consolas".*budget/);
  assert.match(document, /<w:pgSz w:w="11906" w:h="16838"\/>/);
});

test("numbers lists as Word lists, restarting each ordered list at 1", () => {
  const files = buildDocx();
  const document = files.get("word/document.xml")!;
  const numIds = [...document.matchAll(/<w:numId w:val="(\d+)"\/>/g)].map((match) => match[1]);
  // Two bullets, the first ordered list, then a second ordered list after a paragraph.
  assert.deepEqual(numIds, ["1", "1", "2", "2", "3"]);

  const numbering = files.get("word/numbering.xml")!;
  assert.match(numbering, /<w:num w:numId="1"><w:abstractNumId w:val="0"\/><\/w:num>/);
  for (const id of ["2", "3"]) {
    assert.match(numbering, new RegExp(`<w:num w:numId="${id}"><w:abstractNumId w:val="1"/><w:lvlOverride w:ilvl="0"><w:startOverride w:val="1"/>`));
  }
  assert.ok(numbering.lastIndexOf("<w:abstractNum ") < numbering.indexOf("<w:num "), "abstract numbering comes first");
});
