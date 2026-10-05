import { RequireAdmin } from "@/components/admin/require-admin";
import { CouponsManager } from "./coupons-manager";
import { prisma } from "@/lib/db";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <RequireAdmin>
      <CouponsManager initialCoupons={JSON.parse(JSON.stringify(coupons))} />
    </RequireAdmin>
  );
}
