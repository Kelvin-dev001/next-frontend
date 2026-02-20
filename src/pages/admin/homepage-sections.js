"use client";
import RequireAdmin from "@/components/RequireAdmin";
import AdminLayout from "@/layouts/AdminLayout";
import HomepageSectionsList from "@/components/HomepageSectionsList";

export default function HomepageSectionsPage() {
  return (
    <RequireAdmin>
      <AdminLayout>
        <HomepageSectionsList />
      </AdminLayout>
    </RequireAdmin>
  );
}