"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
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
    <div className={cn("space-y-4", pending && "opacity-70")}>
      <Input
        defaultValue={q}
        placeholder="Search sheermal, korma, biryani…"
        className="max-w-md bg-[#fffaf3]"
        onChange={(e) => update({ q: e.target.value })}
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => update({ category: "" })}
          className={cn(
            "border px-3 py-1.5 text-sm transition",
            !active
              ? "border-[var(--brand-chili)] bg-[var(--brand-chili)] text-white"
              : "border-[#e0cdb4] bg-[#fffaf3] hover:border-[var(--brand-chili)]",
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
              "border px-3 py-1.5 text-sm transition",
              active === c.slug
                ? "border-[var(--brand-chili)] bg-[var(--brand-chili)] text-white"
                : "border-[#e0cdb4] bg-[#fffaf3] hover:border-[var(--brand-chili)]",
            )}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
