import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminTopbarClient } from "@/features/admin-layout/components";
import { ColorsTable } from "@/features/admin-colors/components";
import { getAllColors } from "@/lib/supabase/queries/admin-colors";

export default async function ColoresPage() {
  const colors = await getAllColors();

  return (
    <>
      <AdminTopbarClient title="Gestión de Colores" />

      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-gray-600 mt-1">
              Administra los colores disponibles para los vehículos
            </p>
          </div>

          <Link
            href="/admin/colores/nueva"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#002C5F] text-white rounded-lg hover:bg-[#0957a5] transition-colors font-medium whitespace-nowrap"
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
