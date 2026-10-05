"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ORDER_STATUSES, formatPKR, statusLabel } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Order = {
  id: string;
  orderNumber: string;
  guestName: string;
  guestPhone: string;
  fulfillment: string;
  status: string;
  total: number;
  address: string | null;
  items: { id: string; name: string; quantity: number }[];
};

export function OrdersManager({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState("all");

  const visible = orders.filter((o) => filter === "all" || o.status === filter);

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Update failed");
      return;
    }
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: data.status } : o)));
    toast.success(`Order moved to ${statusLabel(status)}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl">Orders</h1>
          <p className="text-sm text-[var(--brand-ink)]/60">
            Workflow: pending → confirmed → preparing → ready / out for delivery → completed
          </p>
        </div>
        <Select value={filter} onValueChange={(v) => setFilter(v ?? "all")}>
          <SelectTrigger className="w-48 bg-[#fffaf3]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {ORDER_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {statusLabel(s)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {visible.length === 0 ? (
          <p className="border border-dashed border-[#e0cdb4] p-8 text-center text-sm text-[var(--brand-ink)]/55">
            No orders in this status.
          </p>
        ) : (
          visible.map((order) => (
            <div key={order.id} className="border border-[#e0cdb4] bg-[#fffaf3] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{order.orderNumber}</div>
                  <div className="text-sm text-[var(--brand-ink)]/60">
                    {order.guestName} · {order.guestPhone} · {order.fulfillment}
                  </div>
                  <div className="mt-1 text-sm">
                    {order.items.map((i) => `${i.name} × ${i.quantity}`).join(", ")}
                  </div>
                  {order.address && (
                    <div className="mt-1 text-xs text-[var(--brand-ink)]/50">{order.address}</div>
                  )}
                </div>
                <div className="text-right">
                  <Badge variant="secondary">{statusLabel(order.status)}</Badge>
                  <div className="mt-2 font-semibold text-[var(--brand-chili)]">
                    {formatPKR(order.total)}
                  </div>
                </div>
              </div>
              <div className="mt-3 max-w-xs">
                <Select value={order.status} onValueChange={(v) => v && updateStatus(order.id, v)}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {statusLabel(s)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
