/**
 * Builds the meeting report as a Word (.docx) file in the browser, with no
 * dependency: the few Office Open XML parts the report needs, packed into an
 * uncompressed ZIP. The summary arrives already parsed (parseSummaryMarkdown),
 * so headings, lists and bold/code text map onto real Word styles.
 */

import type { MeetingReport, SummaryBlock, SummaryInline } from "./summary";

export const DOCX_MIME_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
const REL_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';

// Tahoma ships with Windows and macOS and covers Thai as well as Latin text.
const FONT = "Tahoma";
// A4 with 16mm side margins, in twentieths of a point.
const PAGE = { width: 11906, height: 16838, marginX: 907, marginY: 1021 };
const LABEL_COLUMN = Math.round((PAGE.width - 2 * PAGE.marginX) * 0.32);
const VALUE_COLUMN = PAGE.width - 2 * PAGE.marginX - LABEL_COLUMN;
const BULLET_NUM_ID = 1;

// Characters XML 1.0 cannot carry at all, even escaped.
const INVALID_XML_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g;

function escapeXml(value: string): string {
  return value
    .replace(INVALID_XML_CHARS, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function run(text: string, props = ""): string {
  if (!text) return "";
  return `<w:r>${props ? `<w:rPr>${props}</w:rPr>` : ""}<w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r>`;
}

function inlineRuns(inlines: SummaryInline[]): string {
  return inlines
    .map((inline) => {
      if (inline.type === "strong") return run(inline.text, "<w:b/><w:bCs/>");
      if (inline.type === "code") {
        return run(
          inline.text,
          '<w:rFonts w:ascii="Consolas" w:hAnsi="Consolas" w:cs="Consolas"/><w:shd w:val="clear" w:color="auto" w:fill="F3F4F6"/>',
        );
      }
      return run(inline.text);
    })
    .join("");
}

function paragraph(content: string, props = ""): string {
  return `<w:p>${props ? `<w:pPr>${props}</w:pPr>` : ""}${content}</w:p>`;
}

function detailsTable(details: MeetingReport["details"]): string {
  const border = (side: string) => `<w:${side} w:val="single" w:sz="4" w:space="0" w:color="D1D5DB"/>`;
  const cell = (width: number, content: string, fill?: string) =>
    `<w:tc><w:tcPr><w:tcW w:w="${width}" w:type="dxa"/>${
      fill ? `<w:shd w:val="clear" w:color="auto" w:fill="${fill}"/>` : ""
    }</w:tcPr>${paragraph(content, '<w:spacing w:before="60" w:after="60"/>')}</w:tc>`;

  const rows = details
    .map(
      ({ label, value }) =>
        `<w:tr>${cell(LABEL_COLUMN, run(label, "<w:b/><w:bCs/>"), "F3F4F6")}${cell(VALUE_COLUMN, run(value))}</w:tr>`,
    )
    .join("");

  return (
    "<w:tbl><w:tblPr>" +
    `<w:tblW w:w="${LABEL_COLUMN + VALUE_COLUMN}" w:type="dxa"/>` +
    `<w:tblBorders>${["top", "left", "bottom", "right", "insideH", "insideV"].map(border).join("")}</w:tblBorders>` +
    '<w:tblLayout w:type="fixed"/>' +
    '<w:tblCellMar><w:left w:w="115" w:type="dxa"/><w:right w:w="115" w:type="dxa"/></w:tblCellMar>' +
    `</w:tblPr><w:tblGrid><w:gridCol w:w="${LABEL_COLUMN}"/><w:gridCol w:w="${VALUE_COLUMN}"/></w:tblGrid>` +
    rows +
    "</w:tbl>"
  );
}

/** Body paragraphs for the summary, plus one numbering id per ordered list so each restarts at 1. */
function summaryBody(blocks: SummaryBlock[]): { xml: string; orderedNumIds: number[] } {
  const orderedNumIds: number[] = [];
  const xml = blocks
    .map((block) => {
      switch (block.type) {
        case "heading":
          return paragraph(inlineRuns(block.inlines), `<w:pStyle w:val="Heading${block.level}"/>`);
        case "list": {
          let numId = BULLET_NUM_ID;
          if (block.ordered) {
            numId = BULLET_NUM_ID + 1 + orderedNumIds.length;
            orderedNumIds.push(numId);
          }
          const numbering = `<w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="${numId}"/></w:numPr>`;
          return block.items.map((item) => paragraph(inlineRuns(item), numbering)).join("");
        }
        case "paragraph":
          return paragraph(block.lines.map(inlineRuns).join("<w:r><w:br/></w:r>"));
      }
    })
    .join("");
  return { xml, orderedNumIds };
}

function documentXml(report: MeetingReport, body: string): string {
  return (
    `${XML_DECLARATION}<w:document xmlns:w="${W_NS}" xmlns:r="${REL_NS}"><w:body>` +
    paragraph(run(report.title), '<w:pStyle w:val="Title"/>') +
    detailsTable(report.details) +
    // Word needs a paragraph between a table and the next block.
    paragraph("") +
    body +
    `<w:sectPr><w:pgSz w:w="${PAGE.width}" w:h="${PAGE.height}"/>` +
    `<w:pgMar w:top="${PAGE.marginY}" w:right="${PAGE.marginX}" w:bottom="${PAGE.marginY}" w:left="${PAGE.marginX}" w:header="709" w:footer="709" w:gutter="0"/>` +
    "</w:sectPr></w:body></w:document>"
  );
}

function headingStyle(level: 1 | 2 | 3, size: number, spaceBefore: number): string {
  return (
    `<w:style w:type="paragraph" w:styleId="Heading${level}"><w:name w:val="heading ${level}"/>` +
    '<w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/>' +
    `<w:pPr><w:keepNext/><w:spacing w:before="${spaceBefore}" w:after="80"/><w:outlineLvl w:val="${level - 1}"/></w:pPr>` +
    `<w:rPr><w:b/><w:bCs/><w:sz w:val="${size}"/><w:szCs w:val="${size}"/></w:rPr></w:style>`
  );
}

const STYLES_XML =
  `${XML_DECLARATION}<w:styles xmlns:w="${W_NS}">` +
  "<w:docDefaults><w:rPrDefault><w:rPr>" +
  `<w:rFonts w:ascii="${FONT}" w:hAnsi="${FONT}" w:eastAsia="${FONT}" w:cs="${FONT}"/>` +
  '<w:color w:val="111827"/><w:sz w:val="22"/><w:szCs w:val="22"/><w:lang w:val="th-TH" w:bidi="th-TH"/>' +
  "</w:rPr></w:rPrDefault>" +
  '<w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="300" w:lineRule="auto"/></w:pPr></w:pPrDefault>' +
  "</w:docDefaults>" +
  '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>' +
  '<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/>' +
  '<w:pPr><w:spacing w:after="240"/></w:pPr><w:rPr><w:b/><w:bCs/><w:sz w:val="36"/><w:szCs w:val="36"/></w:rPr></w:style>' +
  headingStyle(1, 30, 320) +
  headingStyle(2, 26, 280) +
  headingStyle(3, 24, 220) +
  '<w:style w:type="paragraph" w:styleId="ListParagraph"><w:name w:val="List Paragraph"/><w:basedOn w:val="Normal"/><w:qFormat/>' +
  '<w:pPr><w:spacing w:after="40"/><w:ind w:left="720"/><w:contextualSpacing/></w:pPr></w:style>' +
  "</w:styles>";

function numberingXml(orderedNumIds: number[]): string {
  const abstract = (id: number, format: string, text: string) =>
    `<w:abstractNum w:abstractNumId="${id}"><w:multiLevelType w:val="singleLevel"/>` +
    `<w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="${format}"/><w:lvlText w:val="${text}"/><w:lvlJc w:val="left"/>` +
    '<w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr></w:lvl></w:abstractNum>';

  return (
    `${XML_DECLARATION}<w:numbering xmlns:w="${W_NS}">` +
    abstract(0, "bullet", "•") +
    abstract(1, "decimal", "%1.") +
    `<w:num w:numId="${BULLET_NUM_ID}"><w:abstractNumId w:val="0"/></w:num>` +
    orderedNumIds
      .map(
        (numId) =>
          `<w:num w:numId="${numId}"><w:abstractNumId w:val="1"/>` +
          '<w:lvlOverride w:ilvl="0"><w:startOverride w:val="1"/></w:lvlOverride></w:num>',
      )
      .join("") +
    "</w:numbering>"
  );
}

const CONTENT_TYPES_XML =
  `${XML_DECLARATION}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
  '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
  '<Default Extension="xml" ContentType="application/xml"/>' +
  '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
  '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>' +
  '<Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>' +
  "</Types>";

const PACKAGE_RELS_XML =
  `${XML_DECLARATION}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
  `<Relationship Id="rId1" Type="${REL_NS}/officeDocument" Target="word/document.xml"/>` +
  "</Relationships>";

const DOCUMENT_RELS_XML =
  `${XML_DECLARATION}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
  `<Relationship Id="rId1" Type="${REL_NS}/styles" Target="styles.xml"/>` +
  `<Relationship Id="rId2" Type="${REL_NS}/numbering" Target="numbering.xml"/>` +
  "</Relationships>";

/**
 * The report as .docx bytes. `summaryBlocks` is parseSummaryMarkdown(report.content);
 * it is passed in so this module stays free of runtime imports.
 */
export function createMeetingReportDocx(
  report: MeetingReport,
  summaryBlocks: SummaryBlock[],
  modifiedAt: Date = new Date(),
): Uint8Array<ArrayBuffer> {
  const body = summaryBody(summaryBlocks);
  const encoder = new TextEncoder();
  return createZip(
    [
      // Office expects the content types part first.
      { name: "[Content_Types].xml", data: encoder.encode(CONTENT_TYPES_XML) },
      { name: "_rels/.rels", data: encoder.encode(PACKAGE_RELS_XML) },
      { name: "word/document.xml", data: encoder.encode(documentXml(report, body.xml)) },
      { name: "word/_rels/document.xml.rels", data: encoder.encode(DOCUMENT_RELS_XML) },
      { name: "word/styles.xml", data: encoder.encode(STYLES_XML) },
      { name: "word/numbering.xml", data: encoder.encode(numberingXml(body.orderedNumIds)) },
    ],
    modifiedAt,
  );
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

export function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

/** A store-only (uncompressed) ZIP archive; enough for a few small XML parts. */
export function createZip(files: { name: string; data: Uint8Array }[], modifiedAt: Date = new Date()): Uint8Array<ArrayBuffer> {
  const year = Math.min(2107, Math.max(1980, modifiedAt.getFullYear()));
  const dosTime = (modifiedAt.getHours() << 11) | (modifiedAt.getMinutes() << 5) | Math.floor(modifiedAt.getSeconds() / 2);
  const dosDate = ((year - 1980) << 9) | ((modifiedAt.getMonth() + 1) << 5) | modifiedAt.getDate();
  const UTF8_NAMES = 0x0800;
  const encoder = new TextEncoder();

  const entries = files.map((file) => ({ name: encoder.encode(file.name), data: file.data, crc: crc32(file.data) }));
  const localSize = entries.reduce((sum, entry) => sum + 30 + entry.name.length + entry.data.length, 0);
  const centralSize = entries.reduce((sum, entry) => sum + 46 + entry.name.length, 0);
  const output = new Uint8Array(localSize + centralSize + 22);
  const view = new DataView(output.buffer);
  let offset = 0;

  const u16 = (value: number) => {
    view.setUint16(offset, value, true);
    offset += 2;
  };
  const u32 = (value: number) => {
    view.setUint32(offset, value, true);
    offset += 4;
  };
  const bytes = (value: Uint8Array) => {
    output.set(value, offset);
    offset += value.length;
  };

  const localOffsets: number[] = [];
  for (const entry of entries) {
    localOffsets.push(offset);
    u32(0x04034b50);
    u16(20);
    u16(UTF8_NAMES);
    u16(0); // stored
    u16(dosTime);
    u16(dosDate);
    u32(entry.crc);
    u32(entry.data.length);
    u32(entry.data.length);
    u16(entry.name.length);
    u16(0);
    bytes(entry.name);
    bytes(entry.data);
  }

  const centralOffset = offset;
  entries.forEach((entry, index) => {
    u32(0x02014b50);
    u16(20);
    u16(20);
    u16(UTF8_NAMES);
    u16(0);
    u16(dosTime);
    u16(dosDate);
    u32(entry.crc);
    u32(entry.data.length);
    u32(entry.data.length);
    u16(entry.name.length);
    u16(0); // extra field
    u16(0); // comment
    u16(0); // disk
    u16(0); // internal attributes
    u32(0); // external attributes
    u32(localOffsets[index]);
    bytes(entry.name);
  });

  u32(0x06054b50);
  u16(0);
  u16(0);
  u16(entries.length);
  u16(entries.length);
  u32(centralSize);
  u32(centralOffset);
  u16(0);
  return output;
}
