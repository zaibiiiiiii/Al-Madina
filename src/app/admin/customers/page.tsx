import { RequireAdmin } from "@/components/admin/require-admin";
import { prisma } from "@/lib/db";

export default async function AdminCustomersPage() {
  const customers = await prisma.customer.findMany({
    include: {
      _count: { select: { orders: true } },
      orders: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <RequireAdmin>
      <div className="space-y-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl">Customers</h1>
          <p className="text-sm text-[var(--brand-ink)]/60">
            Guests created from checkout — phone is the primary key for repeat orders
          </p>
        </div>
        <div className="overflow-x-auto border border-[#e0cdb4] bg-[#fffaf3]">
          <table className="w-full text-sm">
            <thead className="bg-[#efe2cf] text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Email</th>
                <th className="p-3">Orders</th>
                <th className="p-3">Last order</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[var(--brand-ink)]/55">
                    No customers yet — place a storefront order to populate this list.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="border-t border-[#e0cdb4]">
                    <td className="p-3 font-medium">{c.name}</td>
                    <td className="p-3">{c.phone}</td>
                    <td className="p-3">{c.email || "—"}</td>
                    <td className="p-3">{c._count.orders}</td>
                    <td className="p-3">{c.orders[0]?.orderNumber || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </RequireAdmin>
  );
}
