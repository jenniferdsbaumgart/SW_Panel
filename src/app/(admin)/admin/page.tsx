"use client";

import { useAdminStore } from "@/stores/admin-store";
import { AdminLogin } from "@/components/admin/admin-login";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default function AdminPage() {
  const isAuthenticated = useAdminStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
}
