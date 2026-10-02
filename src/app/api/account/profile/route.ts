import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { comparePassword, getUserFromRequest, hashPassword } from "@/lib/auth";
import { accountUserSelect, toAccountUser } from "@/lib/account";

const profileSchema = z.object({
  fullname: z.string().trim().min(1, "กรุณากรอกชื่อ").max(100, "ชื่อยาวได้ไม่เกิน 100 ตัวอักษร"),
  // bcrypt only reads the first 72 bytes, so longer passwords would be silently truncated.
  password: z
    .string()
    .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
    .refine((value) => new TextEncoder().encode(value).length <= 72, "รหัสผ่านยาวเกินไป")
    .optional(),
  currentPassword: z.string().optional(),
});

/**
 * Updates the signed-in user's full name and, when given, password. A new
 * password needs the current one, so a left-open session can't take over the account.
 */
export async function PATCH(req: Request) {
  try {
    const user = await getUserFromRequest();
    if (!user) return NextResponse.json({ error: "กรุณาเข้าสู่ระบบอีกครั้ง" }, { status: 401 });

    const body = await req.json().catch(() => null);
    const result = profileSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { fullname, password, currentPassword } = result.data;
    if (password) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "กรุณากรอกรหัสผ่านปัจจุบัน", field: "currentPassword" },
          { status: 400 },
        );
      }
      const stored = await prisma.user.findUnique({ where: { id: user.id }, select: { password: true } });
      if (!stored || !(await comparePassword(currentPassword, stored.password))) {
        return NextResponse.json(
          { error: "รหัสผ่านปัจจุบันไม่ถูกต้อง", field: "currentPassword" },
          { status: 403 },
        );
      }
      if (await comparePassword(password, stored.password)) {
        return NextResponse.json(
          { error: "รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสผ่านปัจจุบัน", field: "password" },
          { status: 400 },
        );
      }
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        fullname,
        ...(password ? { password: await hashPassword(password) } : {}),
      },
      select: accountUserSelect,
    });

    return NextResponse.json({ user: toAccountUser(updated) }, { status: 200 });
  } catch (error) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง" }, { status: 500 });
  }
}
