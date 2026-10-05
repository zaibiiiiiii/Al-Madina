"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

type Settings = {
  name: string;
  googleListingName: string;
  tagline: string;
  description: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  googleMapsUrl: string;
  googleShareUrl: string;
  deliveryFee: number;
  freeDeliveryMin: number;
  minOrderAmount: number;
  taxRate: number;
  pickupEnabled: boolean;
  deliveryEnabled: boolean;
  cashOnly: boolean;
  hoursJson: string;
  rating: number;
  reviewCount: number;
};

export function SettingsForm({ initial }: { initial: Settings }) {
  const [form, setForm] = useState(initial);

  async function save() {
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error || "Save failed");
    setForm(data);
    toast.success("Store settings saved");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">Store settings</h1>
        <p className="text-sm text-[var(--brand-ink)]/60">
          Seeded from Google Business ·{" "}
          <a href={form.googleShareUrl} target="_blank" rel="noreferrer" className="text-[var(--brand-chili)] underline">
            {form.googleShareUrl}
          </a>
        </p>
      </div>

      <div className="space-y-4 border border-[#e0cdb4] bg-[#fffaf3] p-4">
        <div className="space-y-1">
          <Label>Store name</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="space-y-1">
          <Label>Google listing name</Label>
          <Input value={form.googleListingName} disabled />
        </div>
        <div className="space-y-1">
          <Label>Tagline</Label>
          <Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
        </div>
        <div className="space-y-1">
          <Label>Description</Label>
          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label>Address</Label>
            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div className="space-y-1">
            <Label>Phone</Label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="space-y-1">
            <Label>City</Label>
            <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </div>
          <div className="space-y-1">
            <Label>Postal code</Label>
            <Input
              value={form.postalCode}
              onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
            />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1">
            <Label>Delivery fee</Label>
            <Input
              type="number"
              value={form.deliveryFee}
              onChange={(e) => setForm({ ...form, deliveryFee: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-1">
            <Label>Free delivery min</Label>
            <Input
              type="number"
              value={form.freeDeliveryMin}
              onChange={(e) => setForm({ ...form, freeDeliveryMin: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-1">
            <Label>Min order</Label>
            <Input
              type="number"
              value={form.minOrderAmount}
              onChange={(e) => setForm({ ...form, minOrderAmount: Number(e.target.value) })}
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label>Tax rate (0–1)</Label>
          <Input
            type="number"
            step="0.01"
            value={form.taxRate}
            onChange={(e) => setForm({ ...form, taxRate: Number(e.target.value) })}
          />
        </div>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            <Switch
              checked={form.pickupEnabled}
              onCheckedChange={(v) => setForm({ ...form, pickupEnabled: v })}
            />
            Pickup enabled
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Switch
              checked={form.deliveryEnabled}
              onCheckedChange={(v) => setForm({ ...form, deliveryEnabled: v })}
            />
            Delivery enabled
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={form.cashOnly} onCheckedChange={(v) => setForm({ ...form, cashOnly: v })} />
            Cash only
          </label>
        </div>
        <div className="text-sm text-[var(--brand-ink)]/60">
          Google rating: {form.rating.toFixed(1)} ({form.reviewCount} reviews)
        </div>
        <Button className="bg-[var(--brand-chili)]" onClick={save}>
          Save settings
        </Button>
      </div>
    </div>
  );
}
