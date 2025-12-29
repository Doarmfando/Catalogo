import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminTopbarWrapper } from "@/features/admin-layout/components";
import { UserForm } from "@/features/admin-users/components";
import { getUserById } from "@/lib/supabase/queries/admin-users";

export default async function EditarUsuarioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <>
      <AdminTopbarWrapper title={`Editar: ${user.full_name || user.email}`} />

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
          <h1 className="text-2xl font-bold text-gray-900">
            Editar: {user.full_name || user.email}
          </h1>
        </div>

        {/* Form */}
        <UserForm initialData={user} mode="edit" />
      </div>
    </>
  );
}
