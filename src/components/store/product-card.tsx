"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { formatPKR } from "@/lib/format";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    compareAt?: number | null;
    image: string;
    stock: number;
    isFeatured?: boolean;
    category?: { name: string };
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const out = product.stock <= 0;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#e0cdb4]/80 bg-[#fffaf3] shadow-[0_1px_2px_rgba(28,20,16,0.04)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--brand-saffron)]/50 hover:shadow-[0_14px_36px_rgba(28,20,16,0.10)] active:scale-[0.99]">
      <Link href={`/menu/${product.slug}`} className="relative block aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width:640px) 50vw, (max-width:1024px) 50vw, 33vw"
        />
        {product.isFeatured && (
          <span className="absolute top-2 left-2 rounded-full bg-[var(--brand-chili)] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white shadow-sm">
            Favorite
          </span>
        )}
        {out && (
          <span className="absolute inset-0 grid place-items-center bg-black/45 text-xs font-semibold tracking-[0.14em] text-white uppercase">
            Sold out
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        {product.category && (
          <p className="truncate text-[10px] tracking-[0.14em] text-[var(--brand-saffron)] uppercase">
            {product.category.name}
          </p>
        )}
        <Link href={`/menu/${product.slug}`} className="tap mt-1">
          <h3 className="line-clamp-2 font-[family-name:var(--font-display)] text-[0.95rem] leading-snug text-[var(--brand-ink)] sm:text-lg">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 hidden line-clamp-2 text-sm text-[var(--brand-ink)]/60 sm:block">
          {product.description}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div className="min-w-0">
            <div className="truncate text-base font-semibold text-[var(--brand-chili)] sm:text-lg">
              {formatPKR(product.price)}
            </div>
            {product.compareAt ? (
              <div className="text-[11px] text-[var(--brand-ink)]/45 line-through">
                {formatPKR(product.compareAt)}
              </div>
            ) : null}
          </div>
          <button
            type="button"
            disabled={out}
            aria-label={`Add ${product.name} to cart`}
            onClick={() => {
              addItem({
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
              });
              toast.success(`${product.name} added to cart`);
            }}
            className={cn(
              "tap grid size-10 shrink-0 place-items-center rounded-full transition active:scale-90 sm:size-11",
              out
                ? "cursor-not-allowed bg-[#efe2cf] text-[var(--brand-ink)]/35"
                : "bg-[var(--brand-chili)] text-white shadow-sm hover:bg-[#6f1717]",
            )}
          >
            <Plus className="size-5" strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </article>
  );
}