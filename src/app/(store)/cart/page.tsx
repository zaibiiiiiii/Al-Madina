"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatPKR } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { Input } from "@/components/ui/input";

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
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--brand-ink)]">
          Your cart is empty
        </h1>
        <p className="mt-3 text-[var(--brand-ink)]/65">
          Add sheermal, korma trays, or biryani from the menu to get started.
        </p>
        <LinkButton href="/menu" className="mt-6 bg-[var(--brand-chili)] hover:bg-[#6f1717]">
          Browse menu
        </LinkButton>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--brand-ink)]">Cart</h1>
      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex flex-col gap-4 border border-[#e0cdb4] bg-[#fffaf3]/70 p-4 sm:flex-row sm:items-center"
          >
            <div className="relative h-24 w-full overflow-hidden sm:w-28">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <h2 className="font-[family-name:var(--font-display)] text-xl">{item.name}</h2>
              <p className="text-sm text-[var(--brand-chili)]">{formatPKR(item.price)}</p>
            </div>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min={1}
                value={item.quantity}
                className="w-20 bg-white"
                onChange={(e) => setQuantity(item.productId, Number(e.target.value) || 1)}
              />
              <Button variant="outline" onClick={() => removeItem(item.productId)}>
                Remove
              </Button>
            </div>
            <div className="font-semibold sm:w-28 sm:text-right">
              {formatPKR(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-col items-end gap-4 border-t border-[#e0cdb4] pt-6">
        <div className="text-lg">
          Subtotal: <span className="font-semibold text-[var(--brand-chili)]">{formatPKR(subtotal)}</span>
        </div>
        <LinkButton href="/checkout" size="lg" className="bg-[var(--brand-chili)] hover:bg-[#6f1717]">
          Proceed to checkout
        </LinkButton>
      </div>
    </div>
  );
}
