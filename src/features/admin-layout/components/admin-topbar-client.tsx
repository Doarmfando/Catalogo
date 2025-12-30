"use client";

import { AdminTopbar } from "./admin-topbar";
import { useAdminLayout } from "./admin-layout-context";
import { useUser } from "@/contexts/user-context";

interface AdminTopbarClientProps {
  title: string;
}

export function AdminTopbarClient({ title }: AdminTopbarClientProps) {
  const { toggleSidebar } = useAdminLayout();
  const { user } = useUser();

  return (
    <AdminTopbar
      title={title}
      userName={user?.full_name || "Usuario"}
      userEmail={user?.email || ""}
      onMenuClick={toggleSidebar}
    />
  );
}
