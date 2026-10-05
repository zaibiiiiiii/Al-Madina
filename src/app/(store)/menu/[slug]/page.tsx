import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatPKR } from "@/lib/format";
import { AddToCartButton } from "./add-to-cart-button";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  return { title: product?.name ?? "Product" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!product || !product.isActive) notFound();

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2">
      <div className="relative aspect-[4/3] overflow-hidden border border-[#e0cdb4]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width:1024px) 100vw, 50vw"
          priority
        />
      </div>
      <div>
        <Link href={`/menu?category=${product.category.slug}`} className="text-xs tracking-[0.16em] text-[var(--brand-saffron)] uppercase">
          {product.category.name}
        </Link>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-[var(--brand-ink)]">
          {product.name}
        </h1>
        <div className="mt-4 flex items-center gap-3">
          <span className="text-2xl font-semibold text-[var(--brand-chili)]">
            {formatPKR(product.price)}
          </span>
          {product.compareAt ? (
            <span className="text-sm text-[var(--brand-ink)]/45 line-through">
              {formatPKR(product.compareAt)}
            </span>
          ) : null}
          <Badge variant="secondary">{product.stock > 0 ? `${product.stock} in stock` : "Sold out"}</Badge>
        </div>
        <p className="mt-6 text-[var(--brand-ink)]/75 leading-relaxed">{product.description}</p>
        <p className="mt-3 text-sm text-[var(--brand-ink)]/55">Sold by {product.unit}</p>
        <div className="mt-8">
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
