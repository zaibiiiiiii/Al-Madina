import { SiteFooter } from "@/components/store/site-footer";
import { SiteHeader } from "@/components/store/site-header";
import { prisma } from "@/lib/db";

// Store data is database-backed and must be fetched at request time.
// This also prevents CI builds from trying to prerender a local SQLite database.
export const dynamic = "force-dynamic";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const settings = await prisma.storeSettings.findUniqueOrThrow({ where: { id: "store" } });

  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} />
    </>
  );
}
