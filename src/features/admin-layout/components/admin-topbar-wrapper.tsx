import { getCurrentUser } from "@/lib/supabase/queries/auth";
import { AdminTopbar } from "./admin-topbar";

interface AdminTopbarClientProps {
  title: string;
}

export async function AdminTopbarClient({ title }: AdminTopbarClientProps) {
  const user = await getCurrentUser();

  return (
    <AdminTopbar
      title={title}
      userName={user?.name || "Usuario"}
      userEmail={user?.email || ""}
    />
  );
}
