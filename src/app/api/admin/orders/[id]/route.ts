import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ORDER_STATUSES } from "@/lib/format";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const status = String(body.status || "");
  if (!ORDER_STATUSES.includes(status as (typeof ORDER_STATUSES)[number])) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const data: { status: string; paymentStatus?: string } = { status };
  if (status === "completed") data.paymentStatus = "paid";
  if (status === "cancelled") data.paymentStatus = "cancelled";

  const existingOrder = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!existingOrder) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const order = await prisma.$transaction(async (tx) => {
    if (status === "cancelled" && existingOrder.status !== "cancelled") {
      for (const item of existingOrder.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
        await tx.stockMove.create({
          data: {
            productId: item.productId,
            delta: item.quantity,
            reason: "order_cancelled",
            note: `Restored for cancelled order ${existingOrder.orderNumber}`,
          },
        });
      }
    }

    return tx.order.update({
      where: { id },
      data,
      include: { items: true },
    });
  });
  return NextResponse.json(order);
}
