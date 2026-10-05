import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const settings = await prisma.storeSettings.findUniqueOrThrow({ where: { id: "store" } });
  return NextResponse.json(settings);
}
