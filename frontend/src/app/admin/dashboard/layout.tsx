"use client";

import { AdminShell } from "@/admin/AdminShell";
import { RequireAdminAuth } from "@/admin/RequireAdminAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAdminAuth>
      <AdminShell>{children}</AdminShell>
    </RequireAdminAuth>
  );
}
