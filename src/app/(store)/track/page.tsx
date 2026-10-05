"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { formatPKR, statusLabel } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Order = {
  orderNumber: string;
  status: string;
  fulfillment: string;
  total: number;
  guestName: string;
  createdAt: string;
  items: { id: string; name: string; quantity: number; lineTotal: number }[];
};

function TrackForm() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) return;
    // The token lookup is an external synchronization triggered by a URL change.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    fetch(`/api/track?token=${token}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error);
        setOrder(data);
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [searchParams]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOrder(null);
    try {
      const res = await fetch(
        `/api/track?orderNumber=${encodeURIComponent(orderNumber)}&phone=${encodeURIComponent(phone)}`,
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Not found");
      setOrder(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--brand-ink)]">
        Track order
      </h1>
      <p className="mt-2 text-[var(--brand-ink)]/65">
        Guest lookup — enter your order number and the phone used at checkout. Demo orders: AM-1001 /
        AM-1002.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="orderNumber">Order number</Label>
          <Input
            id="orderNumber"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="AM-1002"
            className="bg-[#fffaf3]"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+92 321 7654321"
            className="bg-[#fffaf3]"
            required
          />
        </div>
        <Button type="submit" disabled={loading} className="bg-[var(--brand-chili)] hover:bg-[#6f1717]">
          {loading ? "Looking up…" : "Find order"}
        </Button>
      </form>

      {order && (
        <div className="mt-8 border border-[#e0cdb4] bg-[#fffaf3]/80 p-5">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">{order.orderNumber}</h2>
          <p className="mt-1 text-sm text-[var(--brand-ink)]/65">
            {order.guestName} · {statusLabel(order.status)} · {order.fulfillment}
          </p>
          <p className="mt-3 font-semibold text-[var(--brand-chili)]">{formatPKR(order.total)}</p>
          <ul className="mt-4 space-y-1 text-sm">
            {order.items.map((i) => (
              <li key={i.id} className="flex justify-between">
                <span>
                  {i.name} × {i.quantity}
                </span>
                <span>{formatPKR(i.lineTotal)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading tracker…</div>}>
      <TrackForm />
    </Suspense>
  );
}
