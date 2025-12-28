import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminTopbar } from "@/features/admin-layout/components";
import { ColorsTable } from "@/features/admin-colors/components";
import { getAllColors } from "@/lib/supabase/queries/admin-colors";

export default async function ColoresPage() {
  const colors = await getAllColors();

  return (
    <>
      <AdminTopbar title="Gestión de Colores" />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Colores</h1>
            <p className="text-gray-600 mt-1">
              Administra los colores disponibles para los vehículos
            </p>
          </div>

          <Link
            href="/admin/colores/nueva"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#002C5F] text-white rounded-lg hover:bg-[#0957a5] transition-colors font-medium"
          >
            <Plus className="h-5 w-5" />
            Nuevo Color
          </Link>
        </div>

        {/* Table */}
        <ColorsTable colors={colors} />
      </div>
    </>
  );
}
