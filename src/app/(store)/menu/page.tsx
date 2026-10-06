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
    <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-10">
      <div className="max-w-2xl">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--brand-ink)] sm:text-4xl">
          Menu
        </h1>
        <p className="mt-2 text-sm text-[var(--brand-ink)]/70 sm:text-base">
          Sheermal, pakwan trays, biryani, and tandoor breads — priced in PKR for pickup or delivery
          across Johar.
        </p>
      </div>

      <div className="sticky top-14 z-30 -mx-4 mt-4 border-b border-[#e0cdb4]/60 bg-[#f7f1e8]/95 px-4 py-3 backdrop-blur-md sm:top-16 sm:mx-0 sm:mt-8 sm:rounded-2xl sm:border sm:bg-[#fffaf3]/70 sm:px-4 sm:backdrop-blur-none">
        <MenuFiltersClient categories={categories} />
      </div>

      {products.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-[#e0cdb4] bg-[#fffaf3]/60 p-10 text-center">
          <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--brand-ink)]">
            No dishes match that filter
          </p>
          <p className="mt-2 text-sm text-[var(--brand-ink)]/60">
            Try another category or clear the search to see the full kitchen menu.
          </p>
        </div>
      ) : (
        <>
          <p className="mt-4 mb-3 text-xs tracking-wide text-[var(--brand-ink)]/50 sm:text-sm">
            {products.length} {products.length === 1 ? "item" : "items"}
          </p>
          <div className="grid grid-cols-2 gap-3 pb-6 sm:gap-6 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
