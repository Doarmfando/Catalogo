import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminTopbar } from "@/features/admin-layout/components";
import { FuelTypesTable } from "@/features/admin-fuel-types/components";
import { getAllFuelTypesAdmin } from "@/lib/supabase/queries/admin-fuel-types";

export default async function TiposCombustiblePage() {
  const fuelTypes = await getAllFuelTypesAdmin();

  return (
    <>
      <AdminTopbar title="Tipos de Combustible" />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tipos de Combustible</h1>
            <p className="text-gray-600 mt-1">
              Administra los tipos de combustible de vehículos
            </p>
          </div>

          <Link
            href="/admin/tipos-combustible/nueva"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#002C5F] text-white rounded-lg hover:bg-[#0957a5] transition-colors font-medium"
          >
            <Plus className="h-5 w-5" />
            Nuevo Tipo
          </Link>
        </div>

        {/* Table */}
        <FuelTypesTable fuelTypes={fuelTypes} />
      </div>
    </>
  );
}
