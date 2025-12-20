import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminTopbar } from "@/features/admin-layout/components";
import { UserForm } from "@/features/admin-users/components";

export default function EditarUsuarioPage({ params }: { params: { id: string } }) {
  // Mock data - en producción vendría de una API
  const mockUserData = {
    id: params.id,
    name: "Juan Pérez",
    email: "juan.perez@hyundai.com",
    role: "Administrador",
    status: "Activo",
  };

  return (
    <>
      <AdminTopbar title="Editar Usuario" />

      <div className="p-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin/usuarios"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Usuarios
          </Link>
        </div>

        {/* Form */}
        <UserForm initialData={mockUserData} mode="edit" />
      </div>
    </>
  );
}
