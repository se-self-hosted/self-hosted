import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { accountUserSelect, toAccountUser } from "@/lib/account";
import { AVATAR_MAX_BYTES, avatarSizeError, checkAvatar } from "@/lib/avatar";
import { streamAvatar } from "@/lib/avatar-response";
import { deleteObject, uploadObject } from "@/lib/storage";

// Room for the multipart boundaries and headers around the file itself.
const MULTIPART_OVERHEAD_BYTES = 64 * 1024;

/** Streams the signed-in user's profile photo. */
export async function GET() {
  try {
    const user = await getUserFromRequest();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const row = await prisma.user.findUnique({ where: { id: user.id }, select: { avatarKey: true } });
    return await streamAvatar(row?.avatarKey);
  } catch (error) {
    console.error("Avatar Fetch Error:", error);
    return NextResponse.json({ error: "Unable to load profile photo" }, { status: 500 });
  }
}

/**
 * Replaces the signed-in user's profile photo with the `avatar` file field.
 * Rejections carry a Thai `error` reason the page shows after "ไม่สามารถเปลี่ยนรูปโปรไฟล์ได้".
 */
export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest();
    if (!user) return NextResponse.json({ error: "กรุณาเข้าสู่ระบบอีกครั้ง" }, { status: 401 });

    // Turn away oversized bodies before buffering them.
    const declaredLength = Number(req.headers.get("content-length"));
    if (declaredLength > AVATAR_MAX_BYTES + MULTIPART_OVERHEAD_BYTES) {
      return NextResponse.json(
        { error: `ไฟล์มีขนาดเกินกำหนด ${AVATAR_MAX_BYTES / (1024 * 1024)}MB` },
        { status: 413 },
      );
    }

    const formData = await req.formData().catch(() => null);
    const file = formData?.get("avatar");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "ไม่พบไฟล์รูปภาพ" }, { status: 400 });
    }

    const sizeError = avatarSizeError(file.size);
    if (sizeError) {
      return NextResponse.json({ error: sizeError }, { status: file.size > 0 ? 413 : 400 });
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const check = checkAvatar(bytes);
    if (!check.ok) {
      return NextResponse.json({ error: check.reason }, { status: 422 });
    }

    const previous = await prisma.user.findUnique({ where: { id: user.id }, select: { avatarKey: true } });
    const avatarKey = `avatars/${user.id}/${randomUUID()}.${check.format.extension}`;
    try {
      await uploadObject(bytes, avatarKey, check.format.mimeType);
    } catch (uploadError) {
      console.error("Avatar Upload Error:", uploadError);
      return NextResponse.json({ error: "ระบบจัดเก็บไฟล์ไม่พร้อมใช้งาน กรุณาลองใหม่อีกครั้ง" }, { status: 502 });
    }

    const updated = await prisma.user
      .update({ where: { id: user.id }, data: { avatarKey }, select: accountUserSelect })
      .catch(async (updateError) => {
        // Nothing points at the new object yet, so don't leave it behind.
        await deleteObject(avatarKey).catch(() => {});
        throw updateError;
      });

    if (previous?.avatarKey && previous.avatarKey !== avatarKey) {
      void deleteObject(previous.avatarKey).catch((deleteError) => {
        console.warn("Could not delete previous avatar:", previous.avatarKey, deleteError);
      });
    }

    return NextResponse.json({ user: toAccountUser(updated) }, { status: 200 });
  } catch (error) {
    console.error("Avatar Update Error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง" }, { status: 500 });
  }
}
