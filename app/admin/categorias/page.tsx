import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminTopbarWrapper } from "@/features/admin-layout/components";
import { CategoriesTable } from "@/features/admin-categories/components";
import { getAllCategoriesAdmin } from "@/lib/supabase/queries/admin-categories";

export default async function CategoriasPage() {
  const categories = await getAllCategoriesAdmin();

  return (
    <>
      <AdminTopbarWrapper title="Gestión de Categorías" />

      <div className="p-6">
        {/* Header with action button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4 mb-6">
          <Link
            href="/admin/categorias/nueva"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#002C5F] text-white rounded-lg hover:bg-[#0957a5] transition-colors font-medium whitespace-nowrap"
          >
            <Plus className="h-5 w-5" />
            Nueva Categoría
          </Link>
        </div>

        {/* Table */}
        <CategoriesTable categories={categories} />
      </div>
    </>
  );
}
