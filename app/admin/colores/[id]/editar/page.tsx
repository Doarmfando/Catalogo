import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminTopbarClient } from "@/features/admin-layout/components";
import { ColorForm } from "@/features/admin-colors/components";
import { getColorById } from "@/lib/supabase/queries/admin-colors";

export default async function EditarColorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const color = await getColorById(id);

  if (!color) {
    notFound();
  }

  return (
    <>
      <AdminTopbarClient title={`Editar: ${color.name}`} />

      <div className="p-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin/colores"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Colores
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Editar: {color.name}
          </h1>
        </div>

        {/* Form */}
        <ColorForm initialData={color} mode="edit" />
      </div>
    </>
  );
}
