import { getCurrentUser } from "@/lib/supabase/queries/auth";
import { AdminTopbar } from "./admin-topbar";

interface AdminTopbarWrapperProps {
  title: string;
}

export async function AdminTopbarWrapper({ title }: AdminTopbarWrapperProps) {
  const user = await getCurrentUser();

  return (
    <AdminTopbar
      title={title}
      userName={user?.name || "Usuario"}
      userEmail={user?.email || ""}
    />
  );
}
