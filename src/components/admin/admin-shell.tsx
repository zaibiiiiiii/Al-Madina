"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Warehouse,
  BookOpen,
  TicketPercent,
  Settings,
  LogOut,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/inventory", label: "Inventory", icon: Warehouse },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/ledger", label: "Ledger", icon: BookOpen },
  { href: "/admin/coupons", label: "Coupons", icon: TicketPercent },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({
  children,
  adminName,
}: {
  children: React.ReactNode;
  adminName: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-[#f4efe6] text-[#1c1410]">
      <aside className="hidden w-64 shrink-0 flex-col bg-[var(--sidebar)] text-[var(--sidebar-foreground)] md:flex">
        <div className="border-b border-white/10 px-5 py-5">
          <div className="text-xs tracking-[0.2em] text-[var(--brand-gold)] uppercase">Admin</div>
          <div className="font-[family-name:var(--font-display)] text-lg leading-tight">
            Al Madinah Ops
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition",
                  active ? "bg-[var(--sidebar-accent)] text-[var(--brand-gold)]" : "hover:bg-white/5",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-2 border-t border-white/10 p-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-white/5"
          >
            <Store className="size-4" />
            View storefront
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-white/5"
          >
            <LogOut className="size-4" />
            Sign out ({adminName})
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[#e0cdb4] bg-[#fffaf3]/90 px-4 py-3 md:hidden">
          <div className="font-[family-name:var(--font-display)] text-[var(--brand-chili)]">
            Al Madinah Admin
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            Sign out
          </Button>
        </header>
        <div className="flex gap-2 overflow-x-auto border-b border-[#e0cdb4] bg-[#fffaf3] px-3 py-2 md:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1 text-xs",
                pathname === item.href
                  ? "border-[var(--brand-chili)] bg-[var(--brand-chili)] text-white"
                  : "border-[#e0cdb4]",
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
