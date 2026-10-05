import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPKR, statusLabel } from "@/lib/format";
import { LinkButton } from "@/components/ui/link-button";
import { notFound } from "next/navigation";

export default async function ConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { orderNumber } = await params;
  const { token } = await searchParams;

  const order = await prisma.order.findFirst({
    where: {
      orderNumber,
      ...(token ? { trackingToken: token } : {}),
    },
    include: { items: true },
  });

  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <p className="text-sm tracking-[0.18em] text-[var(--brand-leaf)] uppercase">Order confirmed</p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-[var(--brand-ink)]">
        Shukriya, {order.guestName}
      </h1>
      <p className="mt-3 text-[var(--brand-ink)]/70">
        Your order <strong>{order.orderNumber}</strong> is {statusLabel(order.status).toLowerCase()}.
        Payment is mock cash on {order.fulfillment === "pickup" ? "pickup" : "delivery"} — no card
        was charged.
      </p>

      <div className="mt-8 space-y-3 border border-[#e0cdb4] bg-[#fffaf3]/80 p-5 text-sm">
        <div className="flex justify-between">
          <span>Status</span>
          <span className="font-medium">{statusLabel(order.status)}</span>
        </div>
        <div className="flex justify-between">
          <span>Fulfillment</span>
          <span className="capitalize">{order.fulfillment}</span>
        </div>
        <div className="flex justify-between">
          <span>Total</span>
          <span className="font-semibold text-[var(--brand-chili)]">{formatPKR(order.total)}</span>
        </div>
        <div className="border-t border-[#e0cdb4] pt-3">
          {order.items.map((i) => (
            <div key={i.id} className="flex justify-between py-1">
              <span>
                {i.name} × {i.quantity}
              </span>
              <span>{formatPKR(i.lineTotal)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <LinkButton href={`/track?token=${order.trackingToken}`} className="bg-[var(--brand-chili)] hover:bg-[#6f1717]">
          Track this order
        </LinkButton>
        <LinkButton href="/menu" variant="outline">
          Order more
        </LinkButton>
      </div>
    </div>
  );
}
