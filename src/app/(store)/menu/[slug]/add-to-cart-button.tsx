"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { formatPKR } from "@/lib/format";
import { Button } from "@/components/ui/button";

export function AddToCartButton({
  product,
}: {
  product: { id: string; name: string; price: number; image: string; stock: number };
}) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const out = product.stock <= 0;

  function add() {
    addItem(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      },
      qty,
    );
    toast.success(`${qty} × ${product.name} added to cart`);
  }

  const stepper = (
    <div className="flex h-11 shrink-0 items-center rounded-full border border-[#e0cdb4] bg-[#fffaf3]">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={out || qty <= 1}
        onClick={() => setQty((q) => Math.max(1, q - 1))}
        className="tap grid size-11 place-items-center rounded-full text-[var(--brand-ink)] transition active:scale-90 disabled:opacity-30"
      >
        <Minus className="size-4" />
      </button>
      <span className="w-6 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {qty}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={out || qty >= product.stock}
        onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
        className="tap grid size-11 place-items-center rounded-full text-[var(--brand-ink)] transition active:scale-90 disabled:opacity-30"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );

  const addBtn = (
    <Button
      size="lg"
      disabled={out}
      onClick={add}
      className="h-11 flex-1 rounded-full bg-[var(--brand-chili)] px-6 text-sm font-semibold text-white shadow-md shadow-[#8b1e1e]/25 hover:bg-[#6f1717] sm:h-auto sm:rounded-lg sm:shadow-none"
    >
      {out ? "Sold out" : `Add to cart · ${formatPKR(product.price * qty)}`}
    </Button>
  );

  return (
    <>
      {/* Mobile: thumb-reachable sticky action bar */}
      <div className="fixed inset-x-0 bottom-[calc(4rem+var(--safe-bottom))] z-30 flex items-center gap-3 border-t border-[#e0cdb4] bg-[#fffaf3]/96 px-4 py-3 shadow-[0_-8px_24px_rgba(28,20,16,0.08)] backdrop-blur-md md:hidden">
        {stepper}
        {addBtn}
      </div>

      {/* Desktop: inline */}
      <div className="hidden items-center gap-3 md:flex">
        {stepper}
        {addBtn}
      </div>
    </>
  );
}