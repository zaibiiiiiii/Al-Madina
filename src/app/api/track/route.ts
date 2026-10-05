import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get("orderNumber")?.trim();
  const phone = searchParams.get("phone")?.trim();
  const token = searchParams.get("token")?.trim();

  if (token) {
    const order = await prisma.order.findUnique({
      where: { trackingToken: token },
      include: { items: true },
    });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json(order);
  }

  if (!orderNumber || !phone) {
    return NextResponse.json({ error: "Provide order number and phone, or tracking token" }, { status: 400 });
  }

  const order = await prisma.order.findFirst({
    where: {
      orderNumber: { equals: orderNumber },
      guestPhone: { contains: phone.replace(/\s+/g, "") },
    },
    include: { items: true },
  });

  if (!order) {
    // fallback: loose phone match
    const fallback = await prisma.order.findFirst({
      where: { orderNumber },
      include: { items: true },
    });
    if (!fallback || !fallback.guestPhone.includes(phone.replace(/\D/g, "").slice(-7))) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(fallback);
  }

  return NextResponse.json(order);
}
