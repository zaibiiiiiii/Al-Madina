import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const settings = await prisma.storeSettings.findUnique({ where: { id: "store" } });
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ settings, categories });
}

export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const settings = await prisma.storeSettings.update({
    where: { id: "store" },
    data: {
      name: body.name,
      tagline: body.tagline,
      description: body.description,
      address: body.address,
      city: body.city,
      postalCode: body.postalCode,
      phone: body.phone,
      email: body.email,
      deliveryFee: Number(body.deliveryFee),
      freeDeliveryMin: Number(body.freeDeliveryMin),
      minOrderAmount: Number(body.minOrderAmount),
      taxRate: Number(body.taxRate),
      pickupEnabled: Boolean(body.pickupEnabled),
      deliveryEnabled: Boolean(body.deliveryEnabled),
      cashOnly: Boolean(body.cashOnly),
      hoursJson: typeof body.hoursJson === "string" ? body.hoursJson : JSON.stringify(body.hoursJson),
    },
  });
  return NextResponse.json(settings);
}
