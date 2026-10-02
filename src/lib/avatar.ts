/**
 * Profile photo rules, shared by the edit profile page (instant feedback) and
 * the upload API (the check that counts). Pure: safe to import client-side.
 */

export const AVATAR_MAX_BYTES = 5 * 1024 * 1024;
export const AVATAR_MAX_DIMENSION = 4096;
export const AVATAR_ERROR_PREFIX = "ไม่สามารถเปลี่ยนรูปโปรไฟล์ได้";

export type AvatarFormat = {
  mimeType: "image/png" | "image/jpeg" | "image/webp";
  extension: "png" | "jpg" | "webp";
};

export type AvatarCheck =
  | { ok: true; format: AvatarFormat; width: number; height: number }
  | { ok: false; reason: string };

const PNG: AvatarFormat = { mimeType: "image/png", extension: "png" };
const JPEG: AvatarFormat = { mimeType: "image/jpeg", extension: "jpg" };
const WEBP: AvatarFormat = { mimeType: "image/webp", extension: "webp" };

const UNSUPPORTED = "รองรับเฉพาะไฟล์ JPG, PNG หรือ WebP";
const UNREADABLE = "ไฟล์รูปภาพเสียหายหรืออ่านขนาดรูปไม่ได้";

/** Reason a file of `size` bytes is rejected, or null when it is within the limit. */
export function avatarSizeError(size: number): string | null {
  if (size <= 0) return "ไฟล์ว่างเปล่า";
  if (size > AVATAR_MAX_BYTES) {
    return `ไฟล์มีขนาด ${(size / (1024 * 1024)).toFixed(1)}MB เกินกำหนด ${AVATAR_MAX_BYTES / (1024 * 1024)}MB`;
  }
  return null;
}

/**
 * Checks size, format (by the file's own bytes, not its name or declared type)
 * and pixel dimensions, read from the image header without decoding it.
 */
export function checkAvatar(bytes: Uint8Array): AvatarCheck {
  const sizeError = avatarSizeError(bytes.length);
  if (sizeError) return { ok: false, reason: sizeError };

  const format = detectFormat(bytes);
  if (!format) return { ok: false, reason: UNSUPPORTED };

  const dimensions = readDimensions(bytes, format);
  if (!dimensions || dimensions.width === 0 || dimensions.height === 0) {
    return { ok: false, reason: UNREADABLE };
  }

  const { width, height } = dimensions;
  if (width > AVATAR_MAX_DIMENSION || height > AVATAR_MAX_DIMENSION) {
    return {
      ok: false,
      reason: `รูปมีขนาด ${width}×${height} พิกเซล เกินกำหนด ${AVATAR_MAX_DIMENSION}×${AVATAR_MAX_DIMENSION} พิกเซล`,
    };
  }
  return { ok: true, format, width, height };
}

/** Format of a stored avatar, from the extension of its object key. */
export function avatarFormatFromKey(key: string): AvatarFormat | null {
  const extension = key.split(".").pop();
  return [PNG, JPEG, WEBP].find((format) => format.extension === extension) ?? null;
}

/** Same-origin URL for a user's avatar; the key's file name busts the cache on change. */
export function avatarUrlFor(avatarKey: string | null): string | null {
  if (!avatarKey) return null;
  const version = avatarKey.split("/").pop()?.split(".")[0] ?? "";
  return `/api/account/avatar?v=${encodeURIComponent(version)}`;
}

function startsWith(bytes: Uint8Array, signature: number[], offset = 0): boolean {
  return signature.every((byte, i) => bytes[offset + i] === byte);
}

function ascii(bytes: Uint8Array, offset: number, length: number): string {
  return String.fromCharCode(...bytes.subarray(offset, offset + length));
}

function detectFormat(bytes: Uint8Array): AvatarFormat | null {
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return PNG;
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return JPEG;
  if (ascii(bytes, 0, 4) === "RIFF" && ascii(bytes, 8, 4) === "WEBP") return WEBP;
  return null;
}

function readDimensions(bytes: Uint8Array, format: AvatarFormat): { width: number; height: number } | null {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  try {
    if (format === PNG) {
      if (ascii(bytes, 12, 4) !== "IHDR") return null;
      return { width: view.getUint32(16), height: view.getUint32(20) };
    }
    if (format === JPEG) return readJpegDimensions(bytes, view);
    return readWebpDimensions(bytes, view);
  } catch {
    // A header cut short reads past the end of the buffer.
    return null;
  }
}

/** Walks the JPEG markers to the first start-of-frame segment, which holds the size. */
function readJpegDimensions(bytes: Uint8Array, view: DataView) {
  let offset = 2;
  while (offset + 4 <= bytes.length) {
    if (bytes[offset] !== 0xff) return null;
    const marker = bytes[offset + 1];
    if (marker === 0xff) {
      offset += 1; // fill byte
      continue;
    }
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd8)) {
      offset += 2; // markers without a length
      continue;
    }
    if (marker === 0xd9 || marker === 0xda) return null; // image data reached, no frame header
    const isStartOfFrame = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isStartOfFrame) {
      return { height: view.getUint16(offset + 5), width: view.getUint16(offset + 7) };
    }
    offset += 2 + view.getUint16(offset + 2);
  }
  return null;
}

function readWebpDimensions(bytes: Uint8Array, view: DataView) {
  const chunk = ascii(bytes, 12, 4);
  if (chunk === "VP8 ") {
    // Lossy: 14-bit sizes after the frame tag and the 9d 01 2a start code.
    if (!startsWith(bytes, [0x9d, 0x01, 0x2a], 23)) return null;
    return { width: view.getUint16(26, true) & 0x3fff, height: view.getUint16(28, true) & 0x3fff };
  }
  if (chunk === "VP8L") {
    // Lossless: two 14-bit (size - 1) fields packed after the 0x2f signature.
    if (bytes[20] !== 0x2f) return null;
    const bits = view.getUint32(21, true);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (chunk === "VP8X") {
    // Extended: 24-bit (canvas size - 1) fields.
    const read24 = (at: number) => bytes[at] | (bytes[at + 1] << 8) | (bytes[at + 2] << 16);
    if (bytes.length < 30) return null;
    return { width: read24(24) + 1, height: read24(27) + 1 };
  }
  return null;
}
