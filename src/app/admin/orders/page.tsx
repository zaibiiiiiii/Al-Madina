import { RequireAdmin } from "@/components/admin/require-admin";
import { OrdersManager } from "./orders-manager";
import { prisma } from "@/lib/db";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true, customer: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <RequireAdmin>
      <OrdersManager initialOrders={JSON.parse(JSON.stringify(orders))} />
    </RequireAdmin>
  );
}
