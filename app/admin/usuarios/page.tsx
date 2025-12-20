import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminTopbar } from "@/features/admin-layout/components";
import { UsersTable } from "@/features/admin-users/components";

export default function UsuariosPage() {
  return (
    <>
      <AdminTopbar title="Gestión de Usuarios" />

      <div className="p-6">
        {/* Header with action button */}
        <div className="flex items-center justify-between mb-6">
          <div></div>
          <Link
            href="/admin/usuarios/nuevo"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#002C5F] text-white rounded-lg hover:bg-[#0957a5] transition-colors font-medium"
          >
            <Plus className="h-5 w-5" />
            Nuevo Usuario
          </Link>
        </div>

        {/* Table */}
        <UsersTable />
      </div>
    </>
  );
}
