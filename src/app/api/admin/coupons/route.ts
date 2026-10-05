import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } }));
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const coupon = await prisma.coupon.create({
    data: {
      code: String(body.code || "").toUpperCase(),
      description: String(body.description || ""),
      type: body.type === "fixed" ? "fixed" : "percent",
      value: Number(body.value || 0),
      minOrder: Number(body.minOrder || 0),
      maxUses: body.maxUses != null && body.maxUses !== "" ? Number(body.maxUses) : null,
      isActive: body.isActive !== false,
    },
  });
  return NextResponse.json(coupon);
}
