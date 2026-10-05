"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Product = { id: string; name: string; stock: number; category: { name: string } };
type Move = {
  id: string;
  delta: number;
  reason: string;
  note: string | null;
  createdAt: string;
  product: { name: string };
};

export function InventoryManager({
  initialProducts,
  initialMoves,
}: {
  initialProducts: Product[];
  initialMoves: Move[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [moves, setMoves] = useState(initialMoves);
  const [productId, setProductId] = useState(initialProducts[0]?.id || "");
  const [delta, setDelta] = useState("10");
  const [reason, setReason] = useState("restock");
  const [note, setNote] = useState("");

  async function adjust() {
    const res = await fetch("/api/admin/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, delta: Number(delta), reason, note }),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error || "Adjustment failed");
    setProducts((prev) => prev.map((p) => (p.id === data.id ? { ...p, stock: data.stock } : p)));
    setMoves((prev) => [
      {
        id: crypto.randomUUID(),
        delta: Number(delta),
        reason,
        note,
        createdAt: new Date().toISOString(),
        product: { name: products.find((p) => p.id === productId)?.name || "" },
      },
      ...prev,
    ]);
    toast.success("Stock updated");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">Inventory</h1>
        <p className="text-sm text-[var(--brand-ink)]/60">Stock levels and adjustment history</p>
      </div>

      <div className="grid gap-4 border border-[#e0cdb4] bg-[#fffaf3] p-4 md:grid-cols-4">
        <div className="space-y-1 md:col-span-2">
          <Label>Product</Label>
          <Select value={productId} onValueChange={(v) => setProductId(v ?? "")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {products.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name} ({p.stock})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Delta (+/-)</Label>
          <Input value={delta} onChange={(e) => setDelta(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>Reason</Label>
          <Input value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>
        <div className="space-y-1 md:col-span-3">
          <Label>Note</Label>
          <Input value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
        <div className="flex items-end">
          <Button className="w-full bg-[var(--brand-chili)]" onClick={adjust}>
            Apply adjustment
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="border border-[#e0cdb4] bg-[#fffaf3]">
          <div className="border-b border-[#e0cdb4] p-3 font-semibold">Current stock</div>
          <div className="max-h-[420px] overflow-auto">
            {products.map((p) => (
              <div key={p.id} className="flex justify-between border-b border-[#e0cdb4]/70 px-3 py-2 text-sm">
                <span>
                  {p.name}
                  <span className="block text-xs text-[var(--brand-ink)]/45">{p.category.name}</span>
                </span>
                <span className={p.stock <= 15 ? "font-semibold text-red-700" : ""}>{p.stock}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="border border-[#e0cdb4] bg-[#fffaf3]">
          <div className="border-b border-[#e0cdb4] p-3 font-semibold">Recent moves</div>
          <div className="max-h-[420px] overflow-auto">
            {moves.map((m) => (
              <div key={m.id} className="border-b border-[#e0cdb4]/70 px-3 py-2 text-sm">
                <div className="flex justify-between">
                  <span>{m.product.name}</span>
                  <span className={m.delta < 0 ? "text-red-700" : "text-emerald-700"}>
                    {m.delta > 0 ? `+${m.delta}` : m.delta}
                  </span>
                </div>
                <div className="text-xs text-[var(--brand-ink)]/50">
                  {m.reason}
                  {m.note ? ` · ${m.note}` : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
