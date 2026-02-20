"use client";
import RequireAdmin from "@/components/RequireAdmin";
import AdminLayout from "@/layouts/AdminLayout";
import BrandList from "@/components/admin/BrandList";

export default function BrandsPage() {
  return (
    <RequireAdmin>
      <AdminLayout>
        <BrandList />
      </AdminLayout>
    </RequireAdmin>
  );
}