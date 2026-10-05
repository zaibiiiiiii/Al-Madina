import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [products, moves] = await Promise.all([
    prisma.product.findMany({ include: { category: true }, orderBy: { name: "asc" } }),
    prisma.stockMove.findMany({
      include: { product: true },
      orderBy: { createdAt: "desc" },
      take: 40,
    }),
  ]);
  return NextResponse.json({ products, moves });
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const productId = String(body.productId || "");
  const delta = Number(body.delta || 0);
  const reason = String(body.reason || "adjustment");
  const note = body.note ? String(body.note) : undefined;
  if (!productId || !delta) {
    return NextResponse.json({ error: "productId and nonzero delta required" }, { status: 400 });
  }

  const product = await prisma.$transaction(async (tx) => {
    const updated = await tx.product.update({
      where: { id: productId },
      data: { stock: { increment: delta } },
    });
    await tx.stockMove.create({
      data: { productId, delta, reason, note },
    });
    return updated;
  });

  return NextResponse.json(product);
}
