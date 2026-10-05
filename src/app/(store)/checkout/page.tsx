"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { formatPKR } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Settings = {
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  deliveryFee: number;
  freeDeliveryMin: number;
  minOrderAmount: number;
  pickupEnabled: boolean;
  deliveryEnabled: boolean;
  cashOnly: boolean;
};

export default function CheckoutPage() {
  const { items, subtotal, clear, hydrated } = useCart();
  const router = useRouter();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(false);
  const [fulfillment, setFulfillment] = useState<"pickup" | "delivery">("pickup");
  const [form, setForm] = useState({
    guestName: "",
    guestPhone: "",
    guestEmail: "",
    address: "",
    notes: "",
    couponCode: "",
  });

  useEffect(() => {
    fetch("/api/store/settings")
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => toast.error("Could not load store settings"));
  }, []);

  if (!hydrated) {
    return <div className="mx-auto max-w-3xl px-4 py-16 text-center">Loading checkout…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-3xl">Nothing to checkout</h1>
        <LinkButton href="/menu" className="mt-6 bg-[var(--brand-chili)]">
          Back to menu
        </LinkButton>
      </div>
    );
  }

  const deliveryFee =
    fulfillment === "delivery" && settings
      ? subtotal >= settings.freeDeliveryMin
        ? 0
        : settings.deliveryFee
      : 0;
  const estimated = subtotal + deliveryFee;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          fulfillment,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      clear();
      router.push(
        `/order/confirmation/${data.orderNumber}?token=${data.trackingToken}`,
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr]">
      <form onSubmit={submit} className="space-y-5">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--brand-ink)]">
          Checkout
        </h1>
        <p className="text-sm text-[var(--brand-ink)]/65">
          Mock local checkout — {settings?.cashOnly ? "cash on delivery / cash at pickup" : "payment"}{" "}
          (no real payment processor).
        </p>

        <div className="flex gap-3">
          <Button
            type="button"
            variant={fulfillment === "pickup" ? "default" : "outline"}
            className={fulfillment === "pickup" ? "bg-[var(--brand-chili)]" : ""}
            disabled={settings ? !settings.pickupEnabled : false}
            onClick={() => setFulfillment("pickup")}
          >
            Pickup
          </Button>
          <Button
            type="button"
            variant={fulfillment === "delivery" ? "default" : "outline"}
            className={fulfillment === "delivery" ? "bg-[var(--brand-chili)]" : ""}
            disabled={settings ? !settings.deliveryEnabled : false}
            onClick={() => setFulfillment("delivery")}
          >
            Delivery
          </Button>
        </div>

        {fulfillment === "pickup" && settings && (
          <div className="border border-[#e0cdb4] bg-[#fffaf3]/80 p-4 text-sm">
            <p className="font-medium">Pickup at store</p>
            <p className="mt-1 text-[var(--brand-ink)]/70">
              {settings.address}, {settings.city} {settings.postalCode}
            </p>
            <p className="mt-1 text-[var(--brand-ink)]/70">Call {settings.phone} if you need directions.</p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              required
              value={form.guestName}
              onChange={(e) => setForm({ ...form, guestName: e.target.value })}
              className="bg-[#fffaf3]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              required
              placeholder="+92 3xx xxx xxxx"
              value={form.guestPhone}
              onChange={(e) => setForm({ ...form, guestPhone: e.target.value })}
              className="bg-[#fffaf3]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email (optional)</Label>
          <Input
            id="email"
            type="email"
            value={form.guestEmail}
            onChange={(e) => setForm({ ...form, guestEmail: e.target.value })}
            className="bg-[#fffaf3]"
          />
        </div>

        {fulfillment === "delivery" && (
          <div className="space-y-2">
            <Label htmlFor="address">Delivery address</Label>
            <Textarea
              id="address"
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="bg-[#fffaf3]"
              placeholder="House / street, Gulistan-e-Johar area"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="coupon">Coupon code</Label>
          <Input
            id="coupon"
            value={form.couponCode}
            onChange={(e) => setForm({ ...form, couponCode: e.target.value })}
            className="bg-[#fffaf3]"
            placeholder="SHEERMAL10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Order notes</Label>
          <Textarea
            id="notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="bg-[#fffaf3]"
          />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="bg-[var(--brand-chili)] hover:bg-[#6f1717]"
        >
          {loading ? "Placing order…" : "Place order (mock cash)"}
        </Button>
      </form>

      <aside className="h-fit border border-[#e0cdb4] bg-[#fffaf3]/80 p-5">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">Order summary</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {items.map((i) => (
            <li key={i.productId} className="flex justify-between gap-3">
              <span>
                {i.name} × {i.quantity}
              </span>
              <span>{formatPKR(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 border-t border-[#e0cdb4] pt-4 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPKR(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>{deliveryFee ? formatPKR(deliveryFee) : "Free / N/A"}</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-[var(--brand-chili)]">
            <span>Estimated total</span>
            <span>{formatPKR(estimated)}</span>
          </div>
          {settings && (
            <p className="pt-2 text-xs text-[var(--brand-ink)]/55">
              Min order {formatPKR(settings.minOrderAmount)}. Free delivery from{" "}
              {formatPKR(settings.freeDeliveryMin)}.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
