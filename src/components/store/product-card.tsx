"use client";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { formatPKR } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    <article className="group flex flex-col overflow-hidden border border-[#e0cdb4] bg-[#fffaf3]/80 transition hover:border-[var(--brand-saffron)]/50 hover:shadow-[0_12px_40px_rgba(28,20,16,0.08)]">
      <Link href={`/menu/${product.slug}`} className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width:768px) 100vw, 33vw"
        />
        {product.isFeatured && (
          <Badge className="absolute top-3 left-3 bg-[var(--brand-chili)] text-white">House favorite</Badge>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          {product.category && (
            <p className="text-[11px] tracking-[0.16em] text-[var(--brand-saffron)] uppercase">
              {product.category.name}
            </p>
          )}
          <Link href={`/menu/${product.slug}`}>
            <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--brand-ink)]">
              {product.name}
            </h3>
          </Link>
          <p className="mt-1 line-clamp-2 text-sm text-[var(--brand-ink)]/65">{product.description}</p>
        </div>
        <div className="mt-auto flex items-end justify-between gap-3">
          <div>
            <div className="text-lg font-semibold text-[var(--brand-chili)]">{formatPKR(product.price)}</div>
            {product.compareAt ? (
              <div className="text-xs text-[var(--brand-ink)]/45 line-through">
                {formatPKR(product.compareAt)}
              </div>
            ) : null}
          </div>
          <Button
            disabled={out}
            className="bg-[var(--brand-chili)] hover:bg-[#6f1717]"
            onClick={() => {
              addItem({
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
              });
              toast.success(`${product.name} added to cart`);
            }}
          >
            {out ? "Sold out" : "Add"}
          </Button>
        </div>
      </div>
    </article>
  );
}
