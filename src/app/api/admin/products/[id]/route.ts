import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: body.name,
      description: body.description,
      price: Number(body.price),
      compareAt: body.compareAt != null && body.compareAt !== "" ? Number(body.compareAt) : null,
      categoryId: body.categoryId,
      image: body.image,
      unit: body.unit,
      isActive: Boolean(body.isActive),
      isFeatured: Boolean(body.isFeatured),
      tags: body.tags ?? "",
    },
  });
  return NextResponse.json(product);
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.product.update({ where: { id }, data: { isActive: false } });
  return NextResponse.json({ ok: true });
}
