"use client";
import RequireAdmin from "@/components/RequireAdmin";
import AdminLayout from "@/layouts/AdminLayout";
import HeroSlidesManager from "@/components/admin/HeroSlidesManager";

export default function HeroSlidesPage() {
  return (
    <RequireAdmin>
      <AdminLayout>
        <HeroSlidesManager />
      </AdminLayout>
    </RequireAdmin>
  );
}
