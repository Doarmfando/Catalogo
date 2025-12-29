import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminTopbarWrapper } from "@/features/admin-layout/components";
import { UsersTable } from "@/features/admin-users/components";
import { getAllUsers } from "@/lib/supabase/queries/admin-users";

export default async function UsuariosPage() {
  const users = await getAllUsers();

  return (
    <>
      <AdminTopbarWrapper title="Gestión de Usuarios" />

      <div className="p-6">
        {/* Header with action button */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
            <p className="text-gray-600 mt-1">
              Administra los usuarios del sistema
            </p>
          </div>
          <Link
            href="/admin/usuarios/nuevo"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#002C5F] text-white rounded-lg hover:bg-[#0957a5] transition-colors font-medium whitespace-nowrap"
          >
            <Plus className="h-5 w-5" />
            Nuevo Usuario
          </Link>
        </div>

        {/* Table */}
        <UsersTable users={users} />
      </div>
    </>
  );
}
