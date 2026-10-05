"use client";

import { useState } from "react";
import { toast } from "sonner";
import { formatPKR } from "@/lib/format";
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

type Entry = {
  id: string;
  type: string;
  category: string;
  description: string;
  amount: number;
  entryDate: string;
  order?: { orderNumber: string } | null;
};

export function LedgerManager({
  initialEntries,
  summary,
}: {
  initialEntries: Entry[];
  summary: { sales: number; expenses: number; cashIn: number; net: number };
}) {
  const [entries, setEntries] = useState(initialEntries);
  const [totals, setTotals] = useState(summary);
  const [form, setForm] = useState({
    type: "expense",
    category: "Ingredients",
    description: "",
    amount: "",
  });

  async function addEntry() {
    const res = await fetch("/api/admin/ledger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, amount: Number(form.amount) }),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error || "Failed");
    setEntries((prev) => [data, ...prev]);
    const amount = Number(form.amount);
    setTotals((t) => {
      const expenses =
        form.type === "expense" || form.type === "cash_out" ? t.expenses + amount : t.expenses;
      const cashIn = form.type === "cash_in" ? t.cashIn + amount : t.cashIn;
      const sales = form.type === "sale" ? t.sales + amount : t.sales;
      return { sales, expenses, cashIn, net: sales + cashIn - expenses };
    });
    setForm({ ...form, description: "", amount: "" });
    toast.success("Ledger entry added");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">Ledger / day book</h1>
        <p className="text-sm text-[var(--brand-ink)]/60">
          Sales, expenses, and simple P&L for Al Madinah kitchen ops
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          ["Sales", totals.sales],
          ["Expenses", totals.expenses],
          ["Cash in", totals.cashIn],
          ["Net", totals.net],
        ].map(([label, value]) => (
          <div key={String(label)} className="border border-[#e0cdb4] bg-[#fffaf3] p-4">
            <div className="text-xs tracking-[0.14em] uppercase text-[var(--brand-ink)]/50">
              {label}
            </div>
            <div className="mt-1 font-[family-name:var(--font-display)] text-xl">
              {formatPKR(Number(value))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-3 border border-[#e0cdb4] bg-[#fffaf3] p-4 md:grid-cols-5">
        <div className="space-y-1">
          <Label>Type</Label>
          <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v ?? "expense" })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="cash_in">Cash in</SelectItem>
              <SelectItem value="cash_out">Cash out</SelectItem>
              <SelectItem value="sale">Sale (manual)</SelectItem>
              <SelectItem value="adjustment">Adjustment</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Category</Label>
          <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        </div>
        <div className="space-y-1 md:col-span-2">
          <Label>Description</Label>
          <Input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label>Amount</Label>
          <Input value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        </div>
        <div className="md:col-span-5">
          <Button className="bg-[var(--brand-chili)]" onClick={addEntry}>
            Add entry
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto border border-[#e0cdb4] bg-[#fffaf3]">
        <table className="w-full text-sm">
          <thead className="bg-[#efe2cf] text-left">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Type</th>
              <th className="p-3">Category</th>
              <th className="p-3">Description</th>
              <th className="p-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id} className="border-t border-[#e0cdb4]">
                <td className="p-3">{new Date(e.entryDate).toLocaleDateString()}</td>
                <td className="p-3 capitalize">{e.type.replace("_", " ")}</td>
                <td className="p-3">{e.category}</td>
                <td className="p-3">
                  {e.description}
                  {e.order ? ` (${e.order.orderNumber})` : ""}
                </td>
                <td className="p-3 text-right font-medium">{formatPKR(e.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
