import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { comparePassword, signJwtToken } from "@/lib/auth";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await signJwtToken({ sub: user.id, email: user.email });

    const response = NextResponse.json(
      { user: { id: user.id, email: user.email, name: user.fullname } },
      { status: 200 }
    );

    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
