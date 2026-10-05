"use client";

import { Suspense } from "react";
import { MenuFilters } from "./menu-filters";

type Category = { id: string; name: string; slug: string };

export function MenuFiltersClient({ categories }: { categories: Category[] }) {
  return (
    <Suspense fallback={<div className="h-20 animate-pulse rounded bg-[#efe2cf]" />}>
      <MenuFilters categories={categories} />
    </Suspense>
  );
}
