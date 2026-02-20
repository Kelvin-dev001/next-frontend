"use client";
import RequireAdmin from "@/components/RequireAdmin";
import AdminLayout from "@/layouts/AdminLayout";
import Dashboard from "@/components/admin/Dashboard";

export default function AdminDashboardPage() {
  return (
    <RequireAdmin>
      <AdminLayout>
        <Dashboard />
      </AdminLayout>
    </RequireAdmin>
  );
}