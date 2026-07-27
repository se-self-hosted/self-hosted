import { NextRequest, NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/auth";
import { prisma } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  // 1. เอา JWT จาก cookie
  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // 2. ตรวจสอบ JWT
  const payload = await verifyJwtToken(token);

  if (!payload || !payload.sub) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // 3. รับข้อมูลห้องจาก Dashboard
    const body = await req.json();

    const { name, maxParticipants } = body;

    // 4. ตรวจชื่อห้อง
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Room name is required" },
        { status: 400 }
      );
    }

    // 5. ตรวจจำนวนผู้เข้าร่วม
    if (
      !Number.isInteger(maxParticipants) ||
      maxParticipants < 1
    ) {
      return NextResponse.json(
        { error: "maxParticipants must be at least 1" },
        { status: 400 }
      );
    }

    // 6. สร้าง slug สำหรับลิงก์ห้อง
    const slug = crypto.randomBytes(12).toString("base64url");

    // 7. สร้าง Room ลง Database
    const room = await prisma.room.create({
      data: {
        name: name.trim(),
        maxParticipants,
        slug,

        // payload.sub คือ id ของ user ที่ login อยู่
        hostId: payload.sub as string,
      },
    });

    // 8. ส่งข้อมูล Room กลับไปที่ Dashboard
    return NextResponse.json(
      { room },
      { status: 201 }
    );

  } catch (error) {
    console.error("Create room error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}