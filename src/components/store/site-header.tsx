"use client";

import Link from "next/link";
import { ShoppingBag, Menu } from "lucide-react";
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
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#e0cdb4]/80 bg-[#f7f1e8]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group min-w-0">
          <div className="font-[family-name:var(--font-display)] text-lg leading-tight text-[var(--brand-chili)] sm:text-xl">
            Al Madinah
          </div>
          <div className="truncate text-[11px] tracking-[0.14em] text-[var(--brand-ink)]/70 uppercase">
            Pakwan and Sheermal House
          </div>
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

        <div className="flex items-center gap-2 md:hidden">
          <LinkButton href="/cart" size="sm" className="bg-[var(--brand-chili)] hover:bg-[#6f1717]">
            <ShoppingBag className="size-4" />
            {count > 0 ? count : ""}
          </LinkButton>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={<Button variant="outline" size="icon" aria-label="Open menu" />}
            >
              <Menu className="size-4" />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="font-[family-name:var(--font-display)] text-[var(--brand-chili)]">
                  Al Madinah
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-4 px-4">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="text-base font-medium"
                  >
                    {l.label}
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
