import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminTopbarClient } from "@/features/admin-layout/components";
import { CategoriesTable } from "@/features/admin-categories/components";
import { getAllCategoriesAdmin } from "@/lib/supabase/queries/admin-categories";

export default async function CategoriasPage() {
  const categories = await getAllCategoriesAdmin();

  return (
    <>
      <AdminTopbarClient title="Gestión de Categorías" />

      <div className="p-4 lg:p-6">
        {/* Header with action button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 lg:gap-4 mb-4 lg:mb-6">
          <Link
            href="/admin/categorias/nueva"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#002C5F] text-white rounded-lg hover:bg-[#0957a5] transition-colors font-medium text-sm whitespace-nowrap"
          >
            <Plus className="h-4 w-4 lg:h-5 lg:w-5" />
            Nueva Categoría
          </Link>
        </div>

        {/* Table */}
        <CategoriesTable categories={categories} />
      </div>
    </>
  );
}
