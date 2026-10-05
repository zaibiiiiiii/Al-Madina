import { RequireAdmin } from "@/components/admin/require-admin";
import { InventoryManager } from "./inventory-manager";
import { prisma } from "@/lib/db";

export default async function AdminInventoryPage() {
  const [products, moves] = await Promise.all([
    prisma.product.findMany({ include: { category: true }, orderBy: { name: "asc" } }),
    prisma.stockMove.findMany({
      include: { product: true },
      orderBy: { createdAt: "desc" },
      take: 40,
    }),
  ]);

  return (
    <RequireAdmin>
      <InventoryManager
        initialProducts={JSON.parse(JSON.stringify(products))}
        initialMoves={JSON.parse(JSON.stringify(moves))}
      />
    </RequireAdmin>
  );
}
