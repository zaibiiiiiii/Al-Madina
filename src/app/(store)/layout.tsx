import { BottomNav } from "@/components/store/bottom-nav";
import { SiteFooter } from "@/components/store/site-footer";
import { SiteHeader } from "@/components/store/site-header";
import { prisma } from "@/lib/db";

// Store data is database-backed and must be fetched at request time.
// This also prevents CI builds from trying to prerender a local SQLite database.
export const dynamic = "force-dynamic";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const settings = await prisma.storeSettings.findUniqueOrThrow({ where: { id: "store" } });

  return (
    <div className="flex min-h-dvh flex-col pb-[calc(4rem+var(--safe-bottom))] md:pb-0">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} />
      <BottomNav />
    </div>
  );
}
