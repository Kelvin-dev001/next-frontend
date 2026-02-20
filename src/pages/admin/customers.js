"use client";
import RequireAdmin from "@/components/RequireAdmin";
import AdminLayout from "@/layouts/AdminLayout";
import Customers from "@/components/admin/Customers";

export default function CustomersPage() {
  return (
    <RequireAdmin>
      <AdminLayout>
        <Customers />
      </AdminLayout>
    </RequireAdmin>
  );
}