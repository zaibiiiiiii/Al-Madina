import { RequireAdmin } from "@/components/admin/require-admin";
import { LedgerManager } from "./ledger-manager";
import { prisma } from "@/lib/db";

export default async function AdminLedgerPage() {
  const entries = await prisma.ledgerEntry.findMany({
    include: { order: true },
    orderBy: { entryDate: "desc" },
  });

  const sales = entries.filter((e) => e.type === "sale").reduce((n, e) => n + e.amount, 0);
  const expenses = entries
    .filter((e) => e.type === "expense" || e.type === "cash_out")
    .reduce((n, e) => n + e.amount, 0);
  const cashIn = entries.filter((e) => e.type === "cash_in").reduce((n, e) => n + e.amount, 0);

  return (
    <RequireAdmin>
      <LedgerManager
        initialEntries={JSON.parse(JSON.stringify(entries))}
        summary={{ sales, expenses, cashIn, net: sales + cashIn - expenses }}
      />
    </RequireAdmin>
  );
}
