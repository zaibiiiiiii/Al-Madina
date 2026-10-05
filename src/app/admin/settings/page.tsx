import { RequireAdmin } from "@/components/admin/require-admin";
import { SettingsForm } from "./settings-form";
import { prisma } from "@/lib/db";

export default async function AdminSettingsPage() {
  const settings = await prisma.storeSettings.findUniqueOrThrow({ where: { id: "store" } });
  return (
    <RequireAdmin>
      <SettingsForm initial={JSON.parse(JSON.stringify(settings))} />
    </RequireAdmin>
  );
}
