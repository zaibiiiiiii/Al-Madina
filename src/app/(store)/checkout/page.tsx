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
    <div className="mx-auto grid max-w-5xl gap-8 px-4 pt-6 pb-36 sm:px-6 sm:pt-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10 lg:pb-10">
      <form id="checkout-form" onSubmit={submit} className="store-form space-y-5">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--brand-ink)] sm:text-4xl">
          Checkout
        </h1>
        <p className="text-sm text-[var(--brand-ink)]/65">
          Mock local checkout — {settings?.cashOnly ? "cash on delivery / cash at pickup" : "payment"}{" "}
          (no real payment processor).
        </p>

        <section className="rounded-2xl border border-[#e0cdb4]/80 bg-[#fffaf3] p-4">
          <h2 className="text-xs font-semibold tracking-[0.16em] text-[var(--brand-ink)]/50 uppercase">
            1 · How would you like it?
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-2 rounded-2xl border border-[#e0cdb4] bg-[#f7f1e8] p-1.5">
            <Button
              type="button"
              variant={fulfillment === "pickup" ? "default" : "ghost"}
              className={
                fulfillment === "pickup"
                  ? "h-11 rounded-xl bg-[var(--brand-chili)] text-base text-white shadow-sm"
                  : "h-11 rounded-xl text-base"
              }
              disabled={settings ? !settings.pickupEnabled : false}
              onClick={() => setFulfillment("pickup")}
            >
              Pickup
            </Button>
            <Button
              type="button"
              variant={fulfillment === "delivery" ? "default" : "ghost"}
              className={
                fulfillment === "delivery"
                  ? "h-11 rounded-xl bg-[var(--brand-chili)] text-base text-white shadow-sm"
                  : "h-11 rounded-xl text-base"
              }
              disabled={settings ? !settings.deliveryEnabled : false}
              onClick={() => setFulfillment("delivery")}
            >
              Delivery
            </Button>
          </div>
        </section>

        {fulfillment === "pickup" && settings && (
          <div className="rounded-2xl border border-[#e0cdb4]/80 bg-[#fffaf3] p-4 text-sm">
            <p className="font-medium">Pickup at store</p>
            <p className="mt-1 text-[var(--brand-ink)]/70">
              {settings.address}, {settings.city} {settings.postalCode}
            </p>
            <p className="mt-1 text-[var(--brand-ink)]/70">Call {settings.phone} if you need directions.</p>
          </div>
        )}

        <h2 className="pt-2 text-xs font-semibold tracking-[0.16em] text-[var(--brand-ink)]/50 uppercase">
          2 · Your details
        </h2>
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
          className="hidden h-12 w-full rounded-full bg-[var(--brand-chili)] text-base hover:bg-[#6f1717] md:inline-flex"
        >
          {loading ? "Placing order…" : "Place order (mock cash)"}
        </Button>
      </form>

      <aside className="h-fit rounded-2xl border border-[#e0cdb4] bg-[#fffaf3]/80 p-5">
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

      {/* Mobile sticky place-order bar */}
      <div className="fixed inset-x-0 bottom-[calc(4rem+var(--safe-bottom))] z-30 flex items-center gap-4 border-t border-[#e0cdb4] bg-[#fffaf3]/96 px-4 py-3 shadow-[0_-8px_24px_rgba(28,20,16,0.08)] backdrop-blur-md md:hidden">
        <div className="min-w-0">
          <p className="text-[11px] tracking-wide text-[var(--brand-ink)]/55 uppercase">Total</p>
          <p className="truncate text-lg leading-tight font-semibold text-[var(--brand-chili)]">
            {formatPKR(estimated)}
          </p>
        </div>
        <Button
          type="submit"
          form="checkout-form"
          disabled={loading}
          onClick={() =>
            (document.getElementById("checkout-form") as HTMLFormElement | null)?.requestSubmit()
          }
          className="ml-auto h-12 flex-1 rounded-full bg-[var(--brand-chili)] px-6 text-base font-semibold text-white shadow-md shadow-[#8b1e1e]/25 hover:bg-[#6f1717]"
        >
          {loading ? "Placing…" : "Place order"}
        </Button>
      </div>
    </div>
  );
}
