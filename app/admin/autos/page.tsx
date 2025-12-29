import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminTopbar } from "@/features/admin-layout/components";
import { CarsTable, CarsSearchFilter } from "@/features/admin-cars/components";
import { getAllCarsAdmin } from "@/lib/supabase/queries/admin-cars";
import { adaptSupabaseCars } from "@/lib/supabase/adapters/cars";

export default async function AutosPage() {
  // Fetch cars from Supabase
  const supabaseCars = await getAllCarsAdmin();
  const cars = adaptSupabaseCars(supabaseCars);

  return (
    <>
      <AdminTopbar title="Gestión de Autos" />

      <div className="p-6">
        {/* Header with action button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <CarsSearchFilter />
          <Link
            href="/admin/autos/nuevo"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#002C5F] text-white rounded-lg hover:bg-[#0957a5] transition-colors font-medium whitespace-nowrap"
          >
            <Plus className="h-5 w-5" />
            Nuevo Auto
          </Link>
        </div>

        {/* Table */}
        <CarsTable cars={cars} />
      </div>
    </>
  );
}
