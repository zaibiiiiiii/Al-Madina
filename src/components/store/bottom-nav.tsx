"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, House, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: House },
  { href: "/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/cart", label: "Cart", icon: ShoppingBag },
  { href: "/track", label: "Track", icon: ClipboardList },
];

export function BottomNav() {
  const pathname = usePathname();
  const { count, hydrated } = useCart();

  return (
    <nav
      aria-label="Primary"
      className="bottom-nav-safe fixed inset-x-0 bottom-0 z-40 border-t border-[#e0cdb4] bg-[#fffaf3]/95 backdrop-blur-md md:hidden"
    >
      <ul className="mx-auto grid h-16 max-w-lg grid-cols-4">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          const showBadge = href === "/cart" && hydrated && count > 0;

          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "tap relative flex h-full flex-col items-center justify-center gap-1 px-1 transition",
                  active
                    ? "text-[var(--brand-chili)]"
                    : "text-[var(--brand-ink)]/55 active:bg-[#f3e6d4]",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0 h-0.5 w-8 rounded-full transition-opacity",
                    active ? "bg-[var(--brand-chili)] opacity-100" : "opacity-0",
                  )}
                />
                <span className="relative">
                  <Icon className="size-[22px]" strokeWidth={active ? 2.2 : 1.7} />
                  {showBadge && (
                    <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--brand-chili)] px-1 text-[10px] leading-none font-bold text-white ring-2 ring-[#fffaf3]">
                      {count > 9 ? "9+" : count}
                    </span>
                  )}
                </span>
                <span className={cn("text-[10px] tracking-wide font-medium", active && "font-semibold")}>
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}