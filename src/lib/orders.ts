import { randomBytes } from "crypto";
import { prisma } from "@/lib/db";

export function nextOrderNumber(seq: number) {
  return `AM-${1000 + seq}`;
}

export function newTrackingToken() {
  return randomBytes(8).toString("hex");
}

export async function createOrderFromCheckout(input: {
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  fulfillment: "pickup" | "delivery";
  address?: string;
  notes?: string;
  couponCode?: string;
  items: { productId: string; quantity: number }[];
}) {
  if (!input.items.length) throw new Error("Cart is empty");

  const settings = await prisma.storeSettings.findUniqueOrThrow({ where: { id: "store" } });
  const products = await prisma.product.findMany({
    where: { id: { in: input.items.map((i) => i.productId) }, isActive: true },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  const lines = input.items.map((item) => {
    const product = productMap.get(item.productId);
    if (!product) throw new Error("Product not found");
    if (product.stock < item.quantity) throw new Error(`Insufficient stock for ${product.name}`);
    return {
      product,
      quantity: item.quantity,
      lineTotal: product.price * item.quantity,
    };
  });

  const subtotal = lines.reduce((n, l) => n + l.lineTotal, 0);
  if (subtotal < settings.minOrderAmount) {
    throw new Error(`Minimum order is Rs ${settings.minOrderAmount}`);
  }

  let discount = 0;
  let couponId: string | undefined;
  let couponCode: string | undefined;

  if (input.couponCode) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: input.couponCode.toUpperCase() },
    });
    if (!coupon || !coupon.isActive) throw new Error("Invalid coupon");
    if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new Error("Coupon expired");
    if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) {
      throw new Error("Coupon usage limit reached");
    }
    if (subtotal < coupon.minOrder) {
      throw new Error(`Coupon requires minimum order of Rs ${coupon.minOrder}`);
    }
    discount =
      coupon.type === "percent"
        ? Math.round((subtotal * coupon.value) / 100)
        : Math.min(coupon.value, subtotal);
    couponId = coupon.id;
    couponCode = coupon.code;
  }

  let deliveryFee = 0;
  if (input.fulfillment === "delivery") {
    if (!settings.deliveryEnabled) throw new Error("Delivery is currently unavailable");
    if (!input.address?.trim()) throw new Error("Delivery address is required");
    deliveryFee = subtotal >= settings.freeDeliveryMin ? 0 : settings.deliveryFee;
  } else if (!settings.pickupEnabled) {
    throw new Error("Pickup is currently unavailable");
  }

  const tax = Math.round(subtotal * settings.taxRate);
  const total = Math.max(0, subtotal - discount + deliveryFee + tax);

  let customer = await prisma.customer.findFirst({
    where: { phone: input.guestPhone },
  });
  if (!customer) {
    customer = await prisma.customer.create({
      data: {
        name: input.guestName,
        phone: input.guestPhone,
        email: input.guestEmail,
        address: input.address,
      },
    });
  } else {
    customer = await prisma.customer.update({
      where: { id: customer.id },
      data: {
        name: input.guestName,
        email: input.guestEmail || customer.email,
        address: input.address || customer.address,
      },
    });
  }

  const orderCount = await prisma.order.count();
  const order = await prisma.$transaction(async (tx) => {
    for (const line of lines) {
      await tx.product.update({
        where: { id: line.product.id },
        data: { stock: { decrement: line.quantity } },
      });
      await tx.stockMove.create({
        data: {
          productId: line.product.id,
          delta: -line.quantity,
          reason: "sale",
          note: "Checkout",
        },
      });
    }

    if (couponId) {
      await tx.coupon.update({
        where: { id: couponId },
        data: { usedCount: { increment: 1 } },
      });
    }

    const created = await tx.order.create({
      data: {
        orderNumber: nextOrderNumber(orderCount + 1),
        customerId: customer!.id,
        guestName: input.guestName,
        guestPhone: input.guestPhone,
        guestEmail: input.guestEmail,
        fulfillment: input.fulfillment,
        address: input.fulfillment === "delivery" ? input.address : settings.address,
        status: "pending",
        paymentMethod: "cash_on_delivery",
        paymentStatus: "pending",
        subtotal,
        discount,
        deliveryFee,
        tax,
        total,
        couponId,
        couponCode,
        notes: input.notes,
        trackingToken: newTrackingToken(),
        items: {
          create: lines.map((l) => ({
            productId: l.product.id,
            name: l.product.name,
            price: l.product.price,
            quantity: l.quantity,
            lineTotal: l.lineTotal,
          })),
        },
      },
      include: { items: true },
    });

    await tx.ledgerEntry.create({
      data: {
        type: "sale",
        category: "Order sales",
        description: `Sale ${created.orderNumber}`,
        amount: created.total,
        orderId: created.id,
      },
    });

    return created;
  });

  return order;
}
