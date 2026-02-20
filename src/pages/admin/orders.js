"use client";
import RequireAdmin from "@/components/RequireAdmin";
import AdminLayout from "@/layouts/AdminLayout";
import Orders from "@/components/admin/Orders";

export default function OrdersPage() {
  return (
    <RequireAdmin>
      <AdminLayout>
        <Orders />
      </AdminLayout>
    </RequireAdmin>
  );
}