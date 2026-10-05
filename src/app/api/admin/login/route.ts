import { NextResponse } from "next/server";
import { loginAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const admin = await loginAdmin(String(body.email || ""), String(body.password || ""));
  if (!admin) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }
  return NextResponse.json({ admin });
}
