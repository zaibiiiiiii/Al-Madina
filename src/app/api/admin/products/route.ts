import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/format";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const name = String(body.name || "").trim();
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const product = await prisma.product.create({
    data: {
      name,
      slug: body.slug || slugify(name),
      description: String(body.description || ""),
      price: Number(body.price || 0),
      compareAt: body.compareAt != null ? Number(body.compareAt) : null,
      categoryId: String(body.categoryId),
      image: String(body.image || "/images/brand/photo-1.jpg"),
      stock: Number(body.stock || 0),
      unit: String(body.unit || "piece"),
      isActive: body.isActive !== false,
      isFeatured: Boolean(body.isFeatured),
      tags: String(body.tags || ""),
    },
  });

  if (product.stock > 0) {
    await prisma.stockMove.create({
      data: {
        productId: product.id,
        delta: product.stock,
        reason: "initial_stock",
        note: "Created via admin",
      },
    });
  }

  return NextResponse.json(product);
}
