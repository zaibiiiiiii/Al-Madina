import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Store } from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatPKR } from "@/lib/format";
import { AddToCartButton } from "./add-to-cart-button";

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
    <div className="mx-auto max-w-6xl pb-28 sm:px-6 sm:pt-8 md:pb-12 lg:grid lg:grid-cols-2 lg:gap-10">
      <div className="relative aspect-square overflow-hidden sm:aspect-[4/3] sm:rounded-2xl sm:border sm:border-[#e0cdb4]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width:1024px) 100vw, 50vw"
          priority
        />
        <Link
          href="/menu"
          aria-label="Back to menu"
          className="tap absolute top-3 left-3 grid size-10 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm transition active:scale-90 lg:hidden"
        >
          <ChevronLeft className="size-5" />
        </Link>
        {product.stock <= 0 && (
          <span className="absolute inset-x-0 bottom-0 bg-black/55 py-2.5 text-center text-xs font-semibold tracking-[0.16em] text-white uppercase backdrop-blur-sm">
            Sold out
          </span>
        )}
      </div>

      <div className="px-4 pt-5 sm:px-0 sm:pt-0">
        <Link
          href={`/menu?category=${product.category.slug}`}
          className="tap inline-flex rounded-full text-xs tracking-[0.16em] text-[var(--brand-saffron)] uppercase hover:underline"
        >
          {product.category.name}
        </Link>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-[1.7rem] leading-tight text-[var(--brand-ink)] sm:text-4xl">
          {product.name}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="text-2xl font-semibold text-[var(--brand-chili)] sm:text-3xl">
            {formatPKR(product.price)}
          </span>
          {product.compareAt ? (
            <span className="text-sm text-[var(--brand-ink)]/45 line-through">
              {formatPKR(product.compareAt)}
            </span>
          ) : null}
          <span
            className={
              product.stock > 0
                ? "rounded-full bg-[#2f5d50]/10 px-2.5 py-1 text-xs font-medium text-[var(--brand-leaf)]"
                : "rounded-full bg-[#b42318]/10 px-2.5 py-1 text-xs font-medium text-[#b42318]"
            }
          >
            {product.stock > 0 ? `${product.stock} in stock` : "Sold out"}
          </span>
        </div>

        <div className="mt-4 hidden h-1 w-20 rounded-full lg:block brand-underline" />

        <p className="mt-4 text-[0.95rem] leading-relaxed text-[var(--brand-ink)]/75 sm:text-base">
          {product.description}
        </p>

        <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#e0cdb4] bg-[#fffaf3]/70 px-4 py-3 text-sm text-[var(--brand-ink)]/70">
          <Store className="size-4 shrink-0 text-[var(--brand-saffron)]" />
          Sold by {product.unit} · Pickup at A-35, Block 4
        </div>

        <div className="mt-6">
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}