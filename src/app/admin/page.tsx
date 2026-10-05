import Link from "next/link";
import { RequireAdmin } from "@/components/admin/require-admin";
import { prisma } from "@/lib/db";
import { formatPKR, statusLabel } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboardPage() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [ordersToday, salesAgg, pending, lowStock, recentOrders, expensesToday, settings] =
    await Promise.all([
      prisma.order.count({
        where: { createdAt: { gte: startOfDay }, status: { not: "cancelled" } },
      }),
      prisma.order.aggregate({
        where: { createdAt: { gte: startOfDay }, status: { not: "cancelled" } },
        _sum: { total: true },
      }),
      prisma.order.count({
        where: { status: { in: ["pending", "confirmed", "preparing", "ready", "out_for_delivery"] } },
      }),
      prisma.product.findMany({
        where: { isActive: true, stock: { lte: 15 } },
        orderBy: { stock: "asc" },
        take: 6,
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
      prisma.storeSettings.findUniqueOrThrow({ where: { id: "store" } }),
    ]);

  const sales = salesAgg._sum.total ?? 0;
  const expenses = expensesToday._sum.amount ?? 0;

  return (
    <RequireAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl">Dashboard</h1>
          <p className="text-sm text-[var(--brand-ink)]/60">
            {settings.name} · {settings.address}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Sales today", value: formatPKR(sales) },
            { label: "Orders today", value: String(ordersToday) },
            { label: "Open kitchen queue", value: String(pending) },
            { label: "Day P&L signal", value: formatPKR(sales - expenses) },
          ].map((card) => (
            <div key={card.label} className="border border-[#e0cdb4] bg-[#fffaf3] p-4">
              <div className="text-xs tracking-[0.14em] text-[var(--brand-ink)]/50 uppercase">
                {card.label}
              </div>
              <div className="mt-2 font-[family-name:var(--font-display)] text-2xl">{card.value}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="border border-[#e0cdb4] bg-[#fffaf3] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold">Recent orders</h2>
              <Link href="/admin/orders" className="text-sm text-[var(--brand-chili)] hover:underline">
                Manage
              </Link>
            </div>
            <div className="space-y-3">
              {recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between gap-3 text-sm">
                  <div>
                    <div className="font-medium">{o.orderNumber}</div>
                    <div className="text-[var(--brand-ink)]/55">
                      {o.guestName} · {o.items.length} items
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">{statusLabel(o.status)}</Badge>
                    <div className="mt-1 font-medium">{formatPKR(o.total)}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="border border-[#e0cdb4] bg-[#fffaf3] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold">Low stock signals</h2>
              <Link
                href="/admin/inventory"
                className="text-sm text-[var(--brand-chili)] hover:underline"
              >
                Adjust
              </Link>
            </div>
            {lowStock.length === 0 ? (
              <p className="text-sm text-[var(--brand-ink)]/55">Inventory looks healthy.</p>
            ) : (
              <div className="space-y-2">
                {lowStock.map((p) => (
                  <div key={p.id} className="flex justify-between text-sm">
                    <span>{p.name}</span>
                    <span className={p.stock <= 5 ? "font-semibold text-red-700" : ""}>
                      {p.stock} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </RequireAdmin>
  );
}
