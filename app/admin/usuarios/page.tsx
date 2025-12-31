import Link from "next/link";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { AdminTopbarClient } from "@/features/admin-layout/components";
import { UsersTable } from "@/features/admin-users/components";
import { getAllUsers } from "@/lib/supabase/queries/admin-users";
import { createClient } from "@/lib/supabase/server";

export default async function UsuariosPage() {
  // Verificar que sea administrador
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', authUser.id)
    .single();

  if (userData?.role !== 'administrador') {
    redirect("/admin/autos");
  }

  const users = await getAllUsers();

  return (
    <>
      <AdminTopbarClient title="Gestión de Usuarios" />

      <div className="p-4 lg:p-6">
        {/* Header with action button */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 lg:gap-4 mb-4 lg:mb-6">
          <div>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Administra los usuarios del sistema
            </p>
          </div>
          <Link
            href="/admin/usuarios/nuevo"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#002C5F] text-white rounded-lg hover:bg-[#0957a5] transition-colors font-medium text-sm whitespace-nowrap"
          >
            <Plus className="h-4 w-4 lg:h-5 lg:w-5" />
            Nuevo Usuario
          </Link>
        </div>

        {/* Table */}
        <UsersTable users={users} />
      </div>
    </>
  );
}
