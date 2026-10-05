import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [ordersToday, salesAgg, pending, lowStock, recentOrders, expensesToday] =
    await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: startOfDay }, status: { not: "cancelled" } } }),
      prisma.order.aggregate({
        where: { createdAt: { gte: startOfDay }, status: { not: "cancelled" } },
        _sum: { total: true },
      }),
      prisma.order.count({ where: { status: { in: ["pending", "confirmed", "preparing"] } } }),
      prisma.product.findMany({
        where: { isActive: true, stock: { lte: 15 } },
        orderBy: { stock: "asc" },
        take: 8,
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { items: true },
      }),
      prisma.ledgerEntry.aggregate({
        where: { type: "expense", entryDate: { gte: startOfDay } },
        _sum: { amount: true },
      }),
    ]);

  const sales = salesAgg._sum.total ?? 0;
  const expenses = expensesToday._sum.amount ?? 0;

  return NextResponse.json({
    ordersToday,
    salesToday: sales,
    pendingOps: pending,
    expensesToday: expenses,
    profitToday: sales - expenses,
    lowStock,
    recentOrders,
  });
}
