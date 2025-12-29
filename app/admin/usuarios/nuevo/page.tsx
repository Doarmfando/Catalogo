import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminTopbarWrapper } from "@/features/admin-layout/components";
import { UserForm } from "@/features/admin-users/components";

export default function NuevoUsuarioPage() {
  return (
    <>
      <AdminTopbarWrapper title="Nuevo Usuario" />

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
        <UserForm />
      </div>
    </>
  );
}
