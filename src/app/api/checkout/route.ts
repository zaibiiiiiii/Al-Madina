import { NextResponse } from "next/server";
import { z } from "zod";
import { createOrderFromCheckout } from "@/lib/orders";

const schema = z.object({
  guestName: z.string().min(2),
  guestPhone: z.string().min(7),
  guestEmail: z.string().email().optional().or(z.literal("")),
  fulfillment: z.enum(["pickup", "delivery"]),
  address: z.string().optional(),
  notes: z.string().optional(),
  couponCode: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const order = await createOrderFromCheckout({
      ...body,
      guestEmail: body.guestEmail || undefined,
    });
    return NextResponse.json({
      orderNumber: order.orderNumber,
      trackingToken: order.trackingToken,
      total: order.total,
      status: order.status,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
