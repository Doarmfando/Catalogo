import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminTopbarClient } from "@/features/admin-layout/components";
import { CategoryForm } from "@/features/admin-categories/components";
import { getCategoryByIdAdmin } from "@/lib/supabase/queries/admin-categories";

export default async function EditarCategoriaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getCategoryByIdAdmin(id);

  if (!category) {
    notFound();
  }

  return (
    <>
      <AdminTopbarClient title={`Editar: ${category.name}`} />

      <div className="p-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin/categorias"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Categorías
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Editar: {category.name}
          </h1>
        </div>

        {/* Form */}
        <CategoryForm initialData={category} mode="edit" />
      </div>
    </>
  );
}
