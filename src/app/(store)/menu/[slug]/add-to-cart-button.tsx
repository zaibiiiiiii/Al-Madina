"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AddToCartButton({
  product,
}: {
  product: { id: string; name: string; price: number; image: string; stock: number };
}) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const out = product.stock <= 0;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        type="number"
        min={1}
        max={product.stock}
        value={qty}
        onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
        className="w-24 bg-[#fffaf3]"
        disabled={out}
      />
      <Button
        size="lg"
        disabled={out}
        className="bg-[var(--brand-chili)] hover:bg-[#6f1717]"
        onClick={() => {
          addItem(
            {
              productId: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
            },
            qty,
          );
          toast.success(`${product.name} added to cart`);
        }}
      >
        {out ? "Sold out" : "Add to cart"}
      </Button>
    </div>
  );
}
