import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminLayoutClient } from "@/features/admin-layout/components";
import { UserProvider } from "@/contexts/user-context";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verificar autenticación
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  // Obtener datos del usuario de la tabla users
  const { data: userData } = await supabase
    .from('users')
    .select('id, email, full_name, role, is_active')
    .eq('id', authUser.id)
    .single();

  if (!userData || !userData.is_active) {
    redirect("/login");
  }

  return (
    <UserProvider user={userData}>
      <AdminLayoutClient>
        {children}
      </AdminLayoutClient>
    </UserProvider>
  );
}
