import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const day = searchParams.get("day"); // YYYY-MM-DD

  let where = {};
  if (day) {
    const start = new Date(`${day}T00:00:00`);
    const end = new Date(`${day}T23:59:59.999`);
    where = { entryDate: { gte: start, lte: end } };
  }

  const entries = await prisma.ledgerEntry.findMany({
    where,
    include: { order: true },
    orderBy: { entryDate: "desc" },
  });

  const sales = entries.filter((e) => e.type === "sale").reduce((n, e) => n + e.amount, 0);
  const expenses = entries
    .filter((e) => e.type === "expense" || e.type === "cash_out")
    .reduce((n, e) => n + e.amount, 0);
  const cashIn = entries.filter((e) => e.type === "cash_in").reduce((n, e) => n + e.amount, 0);

  return NextResponse.json({
    entries,
    summary: {
      sales,
      expenses,
      cashIn,
      net: sales + cashIn - expenses,
    },
  });
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const entry = await prisma.ledgerEntry.create({
    data: {
      type: String(body.type || "expense"),
      category: String(body.category || "General"),
      description: String(body.description || ""),
      amount: Number(body.amount || 0),
      entryDate: body.entryDate ? new Date(body.entryDate) : new Date(),
    },
  });
  return NextResponse.json(entry);
}
