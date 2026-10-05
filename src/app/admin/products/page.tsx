import { RequireAdmin } from "@/components/admin/require-admin";
import { ProductsManager } from "./products-manager";
import { prisma } from "@/lib/db";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ include: { category: true }, orderBy: { updatedAt: "desc" } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <RequireAdmin>
      <ProductsManager
        initialProducts={JSON.parse(JSON.stringify(products))}
        categories={JSON.parse(JSON.stringify(categories))}
      />
    </RequireAdmin>
  );
}
