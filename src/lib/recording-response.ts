import { NextResponse } from "next/server";
import { getRecordingObject } from "./storage";

/**
 * Streams a stored recording, honouring single byte ranges so the browser can
 * seek. `?download=1` saves the file instead of opening it.
 */
export async function streamRecordingObject(
  req: Request,
  file: { objectKey: string; mimeType: string; fileName: string; fileSize?: bigint | number },
) {
  // Ignore malformed/multipart ranges; MinIO handles valid single ranges,
  // including suffix and open-ended requests, and streams only those bytes.
  const requestedRange = req.headers.get("range");
  const range = requestedRange && /^bytes=(?:\d+-\d*|-\d+)$/.test(requestedRange)
    ? requestedRange
    : undefined;
  const object = await getRecordingObject(file.objectKey, range);
  if (object.status === 416) {
    void object.Body?.cancel().catch(() => {});
    return new NextResponse(null, {
      status: 416,
      headers: {
        "Content-Range": object.ContentRange || `bytes */${file.fileSize ?? "*"}`,
        "Cache-Control": "private, no-store",
      },
    });
  }
  if (object.status !== 200 && object.status !== 206) {
    void object.Body?.cancel().catch(() => {});
    return NextResponse.json(
      { error: object.status === 404 ? "Recording file not found" : "Recording storage unavailable" },
      { status: object.status === 404 ? 404 : 502 },
    );
  }
  if (!object.Body) {
    return NextResponse.json({ error: "Recording stream unavailable" }, { status: 502 });
  }

  const headers = new Headers({
    "Content-Type": file.mimeType || object.ContentType,
    "Accept-Ranges": "bytes",
    "Cache-Control": "private, no-store",
  });
  if (object.ContentLength !== undefined) {
    headers.set("Content-Length", String(object.ContentLength));
  }
  if (object.ContentRange) headers.set("Content-Range", object.ContentRange);
  if (new URL(req.url).searchParams.get("download") === "1") {
    headers.set("Content-Disposition", contentDisposition(file.fileName));
  }
  return new NextResponse(object.Body, { status: object.status, headers });
}

/** Attachment header with an ASCII fallback name plus the UTF-8 original (RFC 6266). */
function contentDisposition(fileName: string): string {
  const name = fileName.trim() || "recording";
  const fallback = name.replace(/[^\x20-\x7e]|["\\]/g, "_");
  const encoded = encodeURIComponent(name).replace(/['()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
  return `attachment; filename="${fallback}"; filename*=UTF-8''${encoded}`;
}
