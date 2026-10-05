import { SiteFooter } from "@/components/store/site-footer";
import { SiteHeader } from "@/components/store/site-header";
import { prisma } from "@/lib/db";

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
