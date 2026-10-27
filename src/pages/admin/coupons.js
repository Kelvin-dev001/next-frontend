import RequireAdmin from "@/components/RequireAdmin";
import AdminLayout from "@/layouts/AdminLayout";
import Coupons from "@/components/admin/Coupons";

export default function CouponsPage() {
  return (
    <RequireAdmin>
      <AdminLayout>
        <Coupons />
      </AdminLayout>
    </RequireAdmin>
  );
}
