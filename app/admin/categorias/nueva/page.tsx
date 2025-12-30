import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminTopbarClient } from "@/features/admin-layout/components";
import { CategoryForm } from "@/features/admin-categories/components";

export default function NuevaCategoriaPage() {
  return (
    <>
      <AdminTopbarClient title="Nueva Categoría" />

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
        </div>

        {/* Form */}
        <CategoryForm />
      </div>
    </>
  );
}
