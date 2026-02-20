"use client";
import RequireAdmin from "@/components/RequireAdmin";
import AdminLayout from "@/layouts/AdminLayout";
import CategoryList from "@/components/admin/CategoryList";

export default function CategoriesPage() {
  return (
    <RequireAdmin>
      <AdminLayout>
        <CategoryList />
      </AdminLayout>
    </RequireAdmin>
  );
}