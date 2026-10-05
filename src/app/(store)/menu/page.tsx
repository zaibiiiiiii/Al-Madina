import { ProductCard } from "@/components/store/product-card";
import { prisma } from "@/lib/db";
import { MenuFiltersClient } from "./menu-client";

export const metadata = { title: "Menu" };

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(params.category
        ? { category: { slug: params.category } }
        : {}),
      ...(params.q
        ? {
            OR: [
              { name: { contains: params.q } },
              { description: { contains: params.q } },
              { tags: { contains: params.q } },
            ],
          }
        : {}),
    },
    include: { category: true },
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--brand-ink)]">
          Menu
        </h1>
        <p className="mt-2 text-[var(--brand-ink)]/70">
          Sheermal, pakwan trays, biryani, and tandoor breads — priced in PKR for pickup or delivery
          across Johar.
        </p>
      </div>

      <div className="mt-8">
        <MenuFiltersClient categories={categories} />
      </div>

      {products.length === 0 ? (
        <div className="mt-12 rounded border border-dashed border-[#e0cdb4] bg-[#fffaf3]/60 p-10 text-center">
          <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--brand-ink)]">
            No dishes match that filter
          </p>
          <p className="mt-2 text-sm text-[var(--brand-ink)]/60">
            Try another category or clear the search to see the full kitchen menu.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
