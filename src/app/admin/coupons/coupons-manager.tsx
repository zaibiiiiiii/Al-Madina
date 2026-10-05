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

type Coupon = {
  id: string;
  code: string;
  description: string;
  type: string;
  value: number;
  minOrder: number;
  usedCount: number;
  maxUses: number | null;
  isActive: boolean;
};

export function CouponsManager({ initialCoupons }: { initialCoupons: Coupon[] }) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [form, setForm] = useState({
    code: "",
    description: "",
    type: "percent",
    value: "10",
    minOrder: "1000",
    maxUses: "100",
  });

  async function create() {
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error || "Failed");
    setCoupons((prev) => [data, ...prev]);
    toast.success("Coupon created");
    setForm({ ...form, code: "", description: "" });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">Coupons</h1>
        <p className="text-sm text-[var(--brand-ink)]/60">
          Try storefront codes SHEERMAL10 or JOHAR150
        </p>
      </div>

      <div className="grid gap-3 border border-[#e0cdb4] bg-[#fffaf3] p-4 md:grid-cols-3">
        <div className="space-y-1">
          <Label>Code</Label>
          <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
        </div>
        <div className="space-y-1 md:col-span-2">
          <Label>Description</Label>
          <Input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label>Type</Label>
          <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v ?? "percent" })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percent">Percent</SelectItem>
              <SelectItem value="fixed">Fixed PKR</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Value</Label>
          <Input value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
        </div>
        <div className="space-y-1">
          <Label>Min order</Label>
          <Input
            value={form.minOrder}
            onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
          />
        </div>
        <div className="md:col-span-3">
          <Button className="bg-[var(--brand-chili)]" onClick={create}>
            Create coupon
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto border border-[#e0cdb4] bg-[#fffaf3]">
        <table className="w-full text-sm">
          <thead className="bg-[#efe2cf] text-left">
            <tr>
              <th className="p-3">Code</th>
              <th className="p-3">Offer</th>
              <th className="p-3">Min order</th>
              <th className="p-3">Uses</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-t border-[#e0cdb4]">
                <td className="p-3 font-medium">{c.code}</td>
                <td className="p-3">
                  {c.type === "percent" ? `${c.value}%` : `Rs ${c.value}`} — {c.description}
                </td>
                <td className="p-3">Rs {c.minOrder}</td>
                <td className="p-3">
                  {c.usedCount}
                  {c.maxUses != null ? ` / ${c.maxUses}` : ""}
                </td>
                <td className="p-3">{c.isActive ? "Active" : "Off"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
