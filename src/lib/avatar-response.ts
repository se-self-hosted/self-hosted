import { NextResponse } from "next/server";
import { avatarFormatFromKey } from "./avatar";
import { getObject } from "./storage";

/** Streams a stored profile photo, or 404 when there is none. */
export async function streamAvatar(avatarKey: string | null | undefined) {
  const format = avatarKey ? avatarFormatFromKey(avatarKey) : null;
  if (!avatarKey || !format) {
    return NextResponse.json({ error: "No profile photo" }, { status: 404 });
  }

  const object = await getObject(avatarKey);
  if (object.status !== 200 || !object.Body) {
    void object.Body?.cancel().catch(() => {});
    return NextResponse.json({ error: "Profile photo unavailable" }, { status: object.status === 404 ? 404 : 502 });
  }

  const headers = new Headers({
    "Content-Type": format.mimeType,
    "X-Content-Type-Options": "nosniff",
    // The URL carries the object's id (?v=), so a new photo gets a new URL.
    "Cache-Control": "private, max-age=31536000, immutable",
  });
  if (object.ContentLength !== undefined) headers.set("Content-Length", String(object.ContentLength));
  return new NextResponse(object.Body, { status: 200, headers });
}
