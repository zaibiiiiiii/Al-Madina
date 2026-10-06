"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Category = { id: string; name: string; slug: string };

export function MenuFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const active = searchParams.get("category") || "";
  const q = searchParams.get("q") || "";

  function update(next: { category?: string; q?: string }) {
    const params = new URLSearchParams(searchParams.toString());
    if (next.category !== undefined) {
      if (next.category) params.set("category", next.category);
      else params.delete("category");
    }
    if (next.q !== undefined) {
      if (next.q) params.set("q", next.q);
      else params.delete("q");
    }
    startTransition(() => {
      router.push(`/menu?${params.toString()}`);
    });
  }

  return (
    <div className={cn("space-y-3 transition-opacity", pending && "opacity-60")}>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[var(--brand-ink)]/40" />
        <Input
          defaultValue={q}
          placeholder="Search sheermal, korma, biryani…"
          aria-label="Search the menu"
          className="h-12 rounded-full border-[#e0cdb4] bg-[#fffaf3] pr-4 pl-11 shadow-sm placeholder:text-[var(--brand-ink)]/40"
          onChange={(e) => update({ q: e.target.value })}
        />
      </div>
      <div className="no-scrollbar snap-rail -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        <button
          type="button"
          onClick={() => update({ category: "" })}
          className={cn(
            "tap h-9 shrink-0 rounded-full border px-4 text-sm font-medium whitespace-nowrap transition active:scale-95",
            !active
              ? "border-[var(--brand-chili)] bg-[var(--brand-chili)] text-white shadow-sm"
              : "border-[#e0cdb4] bg-[#fffaf3] hover:border-[var(--brand-chili)] hover:text-[var(--brand-chili)]",
          )}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => update({ category: c.slug })}
            className={cn(
              "tap h-9 shrink-0 rounded-full border px-4 text-sm font-medium whitespace-nowrap transition active:scale-95",
              active === c.slug
                ? "border-[var(--brand-chili)] bg-[var(--brand-chili)] text-white shadow-sm"
                : "border-[#e0cdb4] bg-[#fffaf3] hover:border-[var(--brand-chili)] hover:text-[var(--brand-chili)]",
            )}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}