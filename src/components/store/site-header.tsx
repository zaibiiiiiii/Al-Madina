"use client";

import Link from "next/link";
import { Menu, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const links = [
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/track", label: "Track order" },
  { href: "/admin", label: "Admin" },
];

export function SiteHeader() {
  const { count, hydrated } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e0cdb4]/70 bg-[#f7f1e8]/92 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <Link href="/" className="tap group flex min-w-0 items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--brand-chili)] font-[family-name:var(--font-display)] text-base text-[#fff7ef] shadow-sm transition group-active:scale-95">
            A
          </span>
          <span className="min-w-0">
            <span className="block truncate font-[family-name:var(--font-display)] text-lg leading-tight text-[var(--brand-ink)] sm:text-xl">
              Al Madinah
            </span>
            <span className="hidden truncate text-[10px] tracking-[0.16em] text-[var(--brand-ink)]/55 uppercase sm:block">
              Pakwan and Sheermal House
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-[var(--brand-ink)]/80 transition hover:text-[var(--brand-chili)]"
            >
              {l.label}
            </Link>
          ))}
          <LinkButton href="/cart" className="gap-2 bg-[var(--brand-chili)] hover:bg-[#6f1717]">
            <ShoppingBag className="size-4" />
            Cart{count > 0 ? ` (${count})` : ""}
          </LinkButton>
        </nav>

        <div className="flex items-center gap-1.5 md:hidden">
          <Link
            href="/cart"
            aria-label={`Cart${hydrated && count > 0 ? `, ${count} items` : ""}`}
            className="tap relative grid size-11 place-items-center rounded-full text-[var(--brand-ink)] transition active:scale-95 active:bg-[#efe2cf]"
          >
            <ShoppingBag className="size-[22px]" strokeWidth={1.8} />
            {hydrated && count > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--brand-chili)] px-1 text-[10px] leading-none font-bold text-white ring-2 ring-[#f7f1e8]">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open menu"
                  className="tap size-11 rounded-full active:bg-[#efe2cf]"
                />
              }
            >
              <Menu className="size-[22px]" strokeWidth={1.8} />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="font-[family-name:var(--font-display)] text-[var(--brand-chili)]">
                  Al Madinah
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 flex flex-col px-2">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="tap flex min-h-12 items-center justify-between rounded-xl px-4 text-base font-medium text-[var(--brand-ink)] transition active:bg-[#f3e6d4]"
                  >
                    {l.label}
                    <span className="text-[var(--brand-ink)]/35">›</span>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}