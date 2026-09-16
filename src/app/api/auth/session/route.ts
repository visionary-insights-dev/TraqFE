import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface SessionPayload {
  role: string;
  userId: string;
  organizationId?: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as SessionPayload;
  if (!body.role || !body.userId) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: "role and userId are required" } },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();
  cookieStore.set("traq_session", JSON.stringify(body), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return NextResponse.json({ success: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("traq_session");

  return NextResponse.json({ success: true });
}
