"use client";
import RequireAdmin from "@/components/RequireAdmin";
import AdminLayout from "@/layouts/AdminLayout";
import Products from "@/components/admin/Products";

export default function ProductsPage() {
  return (
    <RequireAdmin>
      <AdminLayout>
        <Products />
      </AdminLayout>
    </RequireAdmin>
  );
}