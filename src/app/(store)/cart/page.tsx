"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPKR } from "@/lib/format";
import { LinkButton } from "@/components/ui/link-button";

export default function CartPage() {
  const { items, setQuantity, removeItem, subtotal, hydrated } = useCart();

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-[var(--brand-ink)]/60">
        Loading your cart…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 py-16 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-[#efe2cf] text-[var(--brand-ink)]/45">
          <ShoppingBag className="size-7" strokeWidth={1.6} />
        </span>
        <h1 className="mt-5 font-[family-name:var(--font-display)] text-3xl text-[var(--brand-ink)]">
          Your cart is empty
        </h1>
        <p className="mt-3 max-w-sm text-[var(--brand-ink)]/65">
          Add sheermal, korma trays, or biryani from the menu to get started.
        </p>
        <LinkButton
          href="/menu"
          className="mt-7 h-12 rounded-full bg-[var(--brand-chili)] px-8 text-base hover:bg-[#6f1717]"
        >
          Browse menu
        </LinkButton>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pt-6 pb-32 sm:px-6 sm:pt-10 md:pb-10">
      <div className="flex items-end justify-between gap-4">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--brand-ink)] sm:text-4xl">
          Cart
        </h1>
        <span className="pb-1.5 text-sm text-[var(--brand-ink)]/55">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="mt-5 space-y-3 sm:mt-8 sm:space-y-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex gap-3 rounded-2xl border border-[#e0cdb4]/80 bg-[#fffaf3] p-3 sm:gap-4 sm:p-4"
          >
            <div className="relative size-20 shrink-0 overflow-hidden rounded-xl sm:size-24">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="truncate font-[family-name:var(--font-display)] text-base leading-snug sm:text-lg">
                    {item.name}
                  </h2>
                  <p className="mt-0.5 text-sm text-[var(--brand-ink)]/55">
                    {formatPKR(item.price)} each
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${item.name} from cart`}
                  onClick={() => removeItem(item.productId)}
                  className="tap -mt-1 -mr-1 grid size-9 shrink-0 place-items-center rounded-full text-[var(--brand-ink)]/45 transition active:scale-90 active:bg-[#f3e6d4] hover:text-[#b42318]"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="mt-auto flex items-center justify-between gap-3 pt-2.5">
                <div className="flex h-9 items-center rounded-full border border-[#e0cdb4] bg-white/70">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={item.quantity <= 1}
                    onClick={() => setQuantity(item.productId, item.quantity - 1)}
                    className="tap grid size-9 place-items-center rounded-full transition active:scale-90 disabled:opacity-30"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity(item.productId, item.quantity + 1)}
                    className="tap grid size-9 place-items-center rounded-full transition active:scale-90"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
                <span className="text-base font-semibold text-[var(--brand-chili)]">
                  {formatPKR(item.price * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 hidden items-end justify-between gap-4 border-t border-[#e0cdb4] pt-6 md:flex">
        <Link href="/menu" className="text-sm font-medium text-[var(--brand-chili)] hover:underline">
          ← Continue shopping
        </Link>
        <div className="flex items-center gap-6">
          <div className="text-lg">
            Subtotal:{" "}
            <span className="font-semibold text-[var(--brand-chili)]">{formatPKR(subtotal)}</span>
          </div>
          <LinkButton href="/checkout" size="lg" className="bg-[var(--brand-chili)] hover:bg-[#6f1717]">
            Proceed to checkout
          </LinkButton>
        </div>
      </div>

      {/* Mobile sticky checkout bar */}
      <div className="fixed inset-x-0 bottom-[calc(4rem+var(--safe-bottom))] z-30 flex items-center gap-4 border-t border-[#e0cdb4] bg-[#fffaf3]/96 px-4 py-3 shadow-[0_-8px_24px_rgba(28,20,16,0.08)] backdrop-blur-md md:hidden">
        <div className="min-w-0">
          <p className="text-[11px] tracking-wide text-[var(--brand-ink)]/55 uppercase">Subtotal</p>
          <p className="truncate text-lg leading-tight font-semibold text-[var(--brand-chili)]">
            {formatPKR(subtotal)}
          </p>
        </div>
        <LinkButton
          href="/checkout"
          className="ml-auto h-12 flex-1 rounded-full bg-[var(--brand-chili)] px-6 text-base font-semibold text-white shadow-md shadow-[#8b1e1e]/25 hover:bg-[#6f1717]"
        >
          Checkout
        </LinkButton>
      </div>
    </div>
  );
}